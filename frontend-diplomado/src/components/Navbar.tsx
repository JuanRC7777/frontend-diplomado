import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
    isActive ? "text-[#F4A261]" : "text-white/80 hover:text-white"
  }`;

export default function Navbar() {
  return (
    <nav className="bg-[#264653] sticky top-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-white font-bold text-lg">
          🐾 PawCare
        </NavLink>
        <div className="flex gap-1">
          <NavLink to="/" className={linkClass} end>
            Inicio
          </NavLink>
          <NavLink to="/adopcion" className={linkClass}>
            Adopción
          </NavLink>
          <NavLink to="/vacunacion" className={linkClass}>
            Vacunación
          </NavLink>
        </div>
      </div>
    </nav>
  );
}