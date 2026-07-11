import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "./Button";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
    isActive ? "text-[#F4A261]" : "text-white/80 hover:text-white"
  }`;

const LINKS = [
  { to: "/", label: "Inicio", end: true },
  { to: "/adopcion", label: "Adopción", end: false },
  { to: "/vacunacion", label: "Vacunación", end: false },
  { to: "/acerca", label: "Acerca de", end: false },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-[#264653] sticky top-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <NavLink to="/" className="text-white font-bold text-lg">
            🐾 PawCare
          </NavLink>

          <div className="hidden md:flex gap-1">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.end}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-white/80">
                  Hola, <strong>{user.nombre}</strong>
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => navigate("/auth")}>
                Iniciar sesión
              </Button>
            )}
          </div>

          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuAbierto && (
          <div className="md:hidden pb-4 flex flex-col gap-2 border-t border-white/10 pt-4">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setMenuAbierto(false)}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <div className="flex flex-col gap-2 mt-2 px-3">
                <span className="text-sm text-white/70">Hola, {user.nombre}</span>
                <Button variant="outline" size="sm" onClick={() => { logout(); setMenuAbierto(false); }}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="px-3 mt-2">
                <Button variant="secondary" size="sm" onClick={() => { navigate("/auth"); setMenuAbierto(false); }}>
                  Iniciar sesión
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
