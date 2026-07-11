import type { Animal } from "../types";

export default function Card({ animal }: { animal: Animal }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-[rgba(38,70,83,0.1)] overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Foto */}
      <img
        src={animal.foto}
        alt={animal.nombre}
        className="w-full h-48 object-cover"
      />

      {/* Cuerpo */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-[#264653]">{animal.nombre}</h3>
        <p className="text-sm text-[#6B675F]">
          {animal.especie} · {animal.raza} · {animal.edad} {animal.unidadEdad}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#264653]/10 text-[#264653]">
            {animal.sexo}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F4A261]/20 text-[#9a5b1f]">
            {animal.tamano}
          </span>
          {animal.vacunado && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              ✓ Vacunado
            </span>
          )}
        </div>

        {/* Descripción */}
        <p className="text-sm text-[#2B2B2B] mt-3 line-clamp-2">{animal.descripcion}</p>

        {/* Ubicación */}
        <p className="text-sm text-[#6B675F] mt-3"> {animal.ciudad}</p>
      </div>
    </article>
  );
}