import { useCallback, useEffect, useState, type ReactNode } from "react";
import { apiFetch, ApiError } from "../lib/api";
import { AuthContext, type AuthResult, type PublicUser, type RegistroDatos } from "./auth-context";

interface SesionResponse {
  accessToken: string;
  user: PublicUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, intenta restaurar la sesión usando el refresh token
  // (cookie httpOnly) para que un F5 no cierre la sesión del usuario.
  useEffect(() => {
    apiFetch<SesionResponse>("/auth/refresh", { method: "POST" })
      .then((data) => {
        setAccessToken(data.accessToken);
        setUser(data.user);
      })
      .catch(() => {
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const data = await apiFetch<SesionResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : "No se pudo iniciar sesión." };
    }
  }, []);

  const register = useCallback(async (datos: RegistroDatos): Promise<AuthResult> => {
    try {
      const data = await apiFetch<SesionResponse>("/auth/register", {
        method: "POST",
        body: datos,
      });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : "No se pudo crear la cuenta." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
