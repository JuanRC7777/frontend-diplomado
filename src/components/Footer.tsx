import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#171717] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">🐾 PawCare</p>
            <p className="text-sm text-white/60 leading-relaxed">
              Plataforma de bienestar animal. Conectamos hogares con animales que necesitan amor y
              facilitamos el acceso a jornadas de vacunación.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Navegación</h4>
            <ul className="space-y-1.5 text-sm text-white/60">
              <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/adopcion" className="hover:text-white transition-colors">Adopción</Link></li>
              <li><Link to="/vacunacion" className="hover:text-white transition-colors">Vacunación</Link></li>
              <li><Link to="/acerca" className="hover:text-white transition-colors">Acerca de</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Contacto</h4>
            <ul className="space-y-1.5 text-sm text-white/70">
              <li>📧 info@pawcare.co</li>
              <li>📍 Colombia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-5 text-center text-xs text-white/40">
          © {new Date().getFullYear()} PawCare — Proyecto del diplomado
        </div>
      </div>
    </footer>
  );
}
