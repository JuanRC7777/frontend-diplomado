import { Link } from "react-router-dom";
import type { Animal } from "../types";
import Button from "./Button";
import { resolverFoto } from "../lib/api";

interface CardProps {
  animal: Animal;
  onEditar?: () => void;
  onEliminar?: () => void;
}

export default function Card({ animal, onEditar, onEliminar }: CardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link to={`/adopcion/${animal.id}`}>
          <img
          src={resolverFoto(animal.foto_url) || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400"}
          alt={animal.nombre}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-5">
        <Link to={`/adopcion/${animal.id}`}>
          <h3 className="text-xl font-bold text-[#171717] hover:underline">{animal.nombre}</h3>
        </Link>
        <p className="text-sm text-[#525252]">
          {animal.especie} · {animal.raza} · {animal.edad} {animal.unidad_edad}
        </p>
        {/* badges de info rapida */}
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
          {animal.estado_salud && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold border border-black text-black">
              {animal.estado_salud}
            </span>
          )}
        </div>

        <p className="text-sm text-[#171717] mt-3 line-clamp-2">{animal.descripcion}</p>
        <p className="text-sm text-[#525252] mt-3"> {animal.ciudad}</p>
        {animal.carnet && <p className="text-xs text-[#525252] mt-1">🪪 {animal.carnet}</p>}

        <Button
          variant="primary"
          size="sm"
          fullWidth
          className="mt-4"
          onClick={() => window.open(`mailto:${animal.contacto_email}`)}
        >
          Quiero adoptarlo
        </Button>

        {(onEditar || onEliminar) && (
          <div className="flex gap-2 mt-2">
            {onEditar && (
              <Button variant="outline" size="sm" fullWidth onClick={onEditar}>
                Editar
              </Button>
            )}
            {onEliminar && (
              <Button variant="outline" size="sm" fullWidth onClick={onEliminar}>
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
