import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FormField from "../components/FormField";
import Button from "../components/Button";

const REG_INICIAL = { nombre: "", email: "", telefono: "", password: "", confirmPassword: "" };
const LOGIN_INICIAL = { email: "", password: "" };

export default function Auth() {
  const [modo, setModo] = useState<"login" | "registro">("login");
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [regForm, setRegForm] = useState(REG_INICIAL);
  const [loginForm, setLoginForm] = useState(LOGIN_INICIAL);
  const [erroresReg, setErroresReg] = useState<Record<string, string>>({});
  const [erroresLogin, setErroresLogin] = useState<Record<string, string>>({});
  const [mensajeExito, setMensajeExito] = useState("");

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErroresReg((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErroresLogin((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  function validarRegistro() {
    const errs: Record<string, string> = {};
    if (!regForm.nombre.trim()) errs.nombre = "El nombre es requerido.";
    if (!regForm.email.trim()) {
      errs.email = "El correo es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) {
      errs.email = "Formato de correo inválido.";
    }
    if (!regForm.password) {
      errs.password = "La contraseña es requerida.";
    } else if (regForm.password.length < 6) {
      errs.password = "La contraseña debe tener mínimo 6 caracteres.";
    }
    if (regForm.password !== regForm.confirmPassword) {
      errs.confirmPassword = "Las contraseñas no coinciden.";
    }
    return errs;
  }

  function validarLogin() {
    const errs: Record<string, string> = {};
    if (!loginForm.email.trim()) errs.email = "El correo es requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) errs.email = "Formato de correo inválido.";
    if (!loginForm.password) errs.password = "La contraseña es requerida.";
    else if (loginForm.password.length < 6) errs.password = "Mínimo 6 caracteres.";
    return errs;
  }

  function handleSubmitRegistro(e: React.FormEvent) {
    e.preventDefault();
    const errs = validarRegistro();
    if (Object.keys(errs).length > 0) {
      setErroresReg(errs);
      return;
    }
    const ok = register({
      nombre: regForm.nombre,
      email: regForm.email,
      telefono: regForm.telefono,
      password: regForm.password,
    });
    if (ok) {
      setMensajeExito("¡Cuenta creada! Redirigiendo...");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setErroresReg({ email: "Este correo ya está registrado." });
    }
  }

  function handleSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    const errs = validarLogin();
    if (Object.keys(errs).length > 0) {
      setErroresLogin(errs);
      return;
    }
    const ok = login(loginForm.email, loginForm.password);
    if (ok) {
      setMensajeExito("¡Bienvenido de vuelta! Redirigiendo...");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setErroresLogin({ email: "Correo o contraseña incorrectos." });
    }
  }

  return (
    <div className="p-10 flex justify-center">
      <div className="w-full max-w-md">
        <div className="flex rounded-xl overflow-hidden border border-[rgba(38,70,83,0.15)] mb-8">
          {(["login", "registro"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setModo(m);
                setErroresLogin({});
                setErroresReg({});
                setMensajeExito("");
              }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors duration-150 ${
                modo === m ? "bg-[#264653] text-white" : "bg-white text-[#6B675F] hover:bg-[#F0EDE4]"
              }`}
            >
              {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          ))}
        </div>

        {mensajeExito && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-semibold text-center">
            ✅ {mensajeExito}
          </div>
        )}

        {modo === "login" ? (
          <form
            onSubmit={handleSubmitLogin}
            className="bg-white rounded-2xl shadow-sm border border-[rgba(38,70,83,0.1)] p-8 flex flex-col gap-5"
          >
            <h1 className="text-2xl font-bold text-[#264653]">Bienvenido de vuelta</h1>

            <FormField
              label="Correo electrónico"
              name="email"
              type="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              error={erroresLogin.email}
              placeholder="tu@correo.com"
            />
            <FormField
              label="Contraseña"
              name="password"
              type="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              error={erroresLogin.password}
              placeholder="Mínimo 6 caracteres"
            />

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Iniciar sesión
            </Button>

            <p className="text-sm text-center text-[#6B675F]">
              ¿No tienes cuenta?{" "}
              <button type="button" className="text-[#2A9D8F] font-semibold hover:underline" onClick={() => setModo("registro")}>
                Regístrate gratis
              </button>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleSubmitRegistro}
            className="bg-white rounded-2xl shadow-sm border border-[rgba(38,70,83,0.1)] p-8 flex flex-col gap-5"
          >
            <h1 className="text-2xl font-bold text-[#264653]">Crear cuenta</h1>

            <FormField label="Nombre completo" name="nombre" value={regForm.nombre} onChange={handleRegChange} error={erroresReg.nombre} placeholder="Ej: María García" />
            <FormField label="Correo electrónico" name="email" type="email" value={regForm.email} onChange={handleRegChange} error={erroresReg.email} placeholder="tu@correo.com" />
            <FormField label="Teléfono" name="telefono" type="tel" value={regForm.telefono} onChange={handleRegChange} error={erroresReg.telefono} placeholder="Ej: 300 123 4567" />
            <FormField label="Contraseña" name="password" type="password" value={regForm.password} onChange={handleRegChange} error={erroresReg.password} placeholder="Mínimo 6 caracteres" />
            <FormField label="Confirmar contraseña" name="confirmPassword" type="password" value={regForm.confirmPassword} onChange={handleRegChange} error={erroresReg.confirmPassword} placeholder="Repite tu contraseña" />

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Crear cuenta
            </Button>

            <p className="text-sm text-center text-[#6B675F]">
              ¿Ya tienes cuenta?{" "}
              <button type="button" className="text-[#2A9D8F] font-semibold hover:underline" onClick={() => setModo("login")}>
                Iniciar sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
