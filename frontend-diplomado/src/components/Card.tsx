import type { Animal } from "../types";
import Button from "./Button";

export default function Card({ animal }: { animal: Animal }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Foto */}
      <img
        src={animal.foto}
        alt={animal.nombre}
        className="w-full h-48 object-cover"
      />

      {/* Cuerpo */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-[#171717]">{animal.nombre}</h3>
        <p className="text-sm text-[#525252]">
          {animal.especie} · {animal.raza} · {animal.edad} {animal.unidadEdad}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#171717]/10 text-[#171717]">
            {animal.sexo}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#171717]/10 text-[#171717]">
            {animal.tamano}
          </span>
          {animal.vacunado && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-200 text-black">
              ✓ Vacunado
            </span>
          )}
        </div>

        {/* Descripción */}
        <p className="text-sm text-[#171717] mt-3 line-clamp-2">{animal.descripcion}</p>

        {/* Ubicación */}
        <p className="text-sm text-[#525252] mt-3"> {animal.ciudad}</p>
        {animal.carnet && (
          <p className="text-xs text-[#525252] mt-1">🪪 {animal.carnet}</p>
        )}

        <Button
          variant="primary"
          size="sm"
          fullWidth
          className="mt-4"
          onClick={() => window.open(`mailto:${animal.contacto}`)}
        >
          Quiero adoptarlo
        </Button>
      </div>
    </article>
  );
}