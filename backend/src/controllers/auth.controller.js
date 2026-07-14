import { pool } from "../db/pool.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { signAccessToken, generateRefreshToken, hashRefreshToken } from "../utils/jwt.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFRESH_COOKIE = "refresh_token";
const REFRESH_MAX_AGE_MS = Number(process.env.JWT_REFRESH_EXPIRES_DAYS ?? 7) * 24 * 60 * 60 * 1000;
const MAX_INTENTOS_FALLIDOS = 5;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_MAX_AGE_MS,
    path: "/api/auth",
  };
}

function toPublicUser(row) {
  return { nombre: row.nombre, email: row.email, telefono: row.telefono ?? undefined };
}

async function issueSession(res, usuario) {
  const accessToken = signAccessToken(usuario);
  const { token, hash } = generateRefreshToken();

  await pool.query(
    "INSERT INTO refresh_tokens (usuario_id, token_hash, expira_en) VALUES (?, ?, ?)",
    [usuario.id, hash, new Date(Date.now() + REFRESH_MAX_AGE_MS)]
  );

  res.cookie(REFRESH_COOKIE, token, cookieOptions());
  return accessToken;
}

export async function register(req, res) {
  const { nombre, email, telefono, password } = req.body ?? {};

  if (!nombre?.trim() || !EMAIL_RE.test(email ?? "") || !password || password.length < 6) {
    return res.status(400).json({ error: "Datos de registro inválidos." });
  }

  const [existentes] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
  if (existentes.length > 0) {
    return res.status(409).json({ error: "Este correo ya está registrado." });
  }

  const password_hash = await hashPassword(password);
  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, email, telefono, password_hash) VALUES (?, ?, ?, ?)",
    [nombre.trim(), email, telefono || null, password_hash]
  );

  const usuario = { id: result.insertId, nombre: nombre.trim(), email, telefono, rol: "usuario" };
  const accessToken = await issueSession(res, usuario);

  res.status(201).json({ accessToken, user: toPublicUser(usuario) });
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  const ip = req.ip;

  if (!EMAIL_RE.test(email ?? "") || !password) {
    return res.status(400).json({ error: "Correo o contraseña inválidos." });
  }

  const [intentos] = await pool.query(
    `SELECT COUNT(*) AS total FROM login_attempts
     WHERE email = ? AND exitoso = 0 AND creado_en > (NOW() - INTERVAL 15 MINUTE)`,
    [email]
  );
  if (intentos[0].total >= MAX_INTENTOS_FALLIDOS) {
    return res.status(429).json({ error: "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos." });
  }

  const [rows] = await pool.query(
    "SELECT id, nombre, email, telefono, password_hash, rol, activo FROM usuarios WHERE email = ?",
    [email]
  );
  const usuario = rows[0];

  // Comparamos siempre contra un hash (aunque el usuario no exista) para
  // no filtrar por temporización si un correo está registrado o no.
  const hashParaComparar = usuario?.password_hash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva";
  const passwordValida = await verifyPassword(password, hashParaComparar);

  await pool.query("INSERT INTO login_attempts (email, ip_address, exitoso) VALUES (?, ?, ?)", [
    email,
    ip,
    usuario && passwordValida ? 1 : 0,
  ]);

  if (!usuario || !usuario.activo || !passwordValida) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  const accessToken = await issueSession(res, usuario);
  res.json({ accessToken, user: toPublicUser(usuario) });
}

export async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ error: "Sin sesión activa." });

  const hash = hashRefreshToken(token);
  const [rows] = await pool.query(
    `SELECT rt.id, rt.expira_en, rt.revocado_en,
            u.id AS usuario_id, u.nombre, u.email, u.telefono, u.rol, u.activo
     FROM refresh_tokens rt
     JOIN usuarios u ON u.id = rt.usuario_id
     WHERE rt.token_hash = ?`,
    [hash]
  );
  const registro = rows[0];
  const invalido =
    !registro || registro.revocado_en || new Date(registro.expira_en) < new Date() || !registro.activo;

  if (invalido) {
    res.clearCookie(REFRESH_COOKIE, cookieOptions());
    return res.status(401).json({ error: "Sesión expirada, inicia sesión de nuevo." });
  }

  // Rotación: el refresh token usado se revoca y se emite uno nuevo, para
  // que un token robado y reutilizado deje huella (reuse detection básico).
  await pool.query("UPDATE refresh_tokens SET revocado_en = NOW() WHERE id = ?", [registro.id]);

  const usuario = {
    id: registro.usuario_id,
    nombre: registro.nombre,
    email: registro.email,
    telefono: registro.telefono,
    rol: registro.rol,
  };
  const accessToken = await issueSession(res, usuario);
  res.json({ accessToken, user: toPublicUser(usuario) });
}

export async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    const hash = hashRefreshToken(token);
    await pool.query(
      "UPDATE refresh_tokens SET revocado_en = NOW() WHERE token_hash = ? AND revocado_en IS NULL",
      [hash]
    );
  }
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
  res.status(204).end();
}

export async function me(req, res) {
  const [rows] = await pool.query("SELECT nombre, email, telefono FROM usuarios WHERE id = ?", [
    req.usuario.sub,
  ]);
  const usuario = rows[0];
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
  res.json({ user: toPublicUser(usuario) });
}
