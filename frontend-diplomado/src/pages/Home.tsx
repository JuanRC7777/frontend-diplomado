import { Link } from "react-router-dom";
import hero from "../assets/hero.png";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      {/* Texto */}
      <div>
        <span className="text-[#525252] text-xs font-bold uppercase tracking-widest">
          Bienestar animal
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-[#171717] mt-3 leading-tight">
          Encuentra tu compañero y cuida a los tuyos 🐾
        </h1>
        <p className="text-[#525252] mt-4 text-lg">
          Adopta un animal que busca hogar o participa en las jornadas de
          vacunación de tu ciudad.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            to="/adopcion"
            className="px-6 py-3 rounded-lg bg-[#171717] text-white font-semibold hover:bg-[#000000]"
          >
            Ver adopciones
          </Link>
          <Link
            to="/vacunacion"
            className="px-6 py-3 rounded-lg border-2 border-[#525252] text-[#525252] font-semibold hover:bg-[#525252] hover:text-white"
          >
            Jornadas de vacunación
          </Link>
        </div>
      </div>

      {/* Imagen */}
      <img
        src={hero}
        alt="Mascotas felices"
        className="rounded-3xl shadow-lg w-full object-cover"
      />
    </div>
  );
}