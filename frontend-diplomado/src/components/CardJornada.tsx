import { Link } from "react-router-dom";
import type { Jornada } from "../types";
import Button from "./Button";

interface CardJornadaProps {
  jornada: Jornada;
  onEditar?: () => void;
  onEliminar?: () => void;
}

export default function CardJornada({ jornada, onEditar, onEliminar }: CardJornadaProps) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] p-5 hover:shadow-lg transition-shadow duration-200">
      <p className="text-xs font-bold uppercase tracking-wide text-[#525252]">
         {jornada.fecha} · {jornada.hora_inicio}–{jornada.hora_fin}
      </p>
      <Link to={`/vacunacion/${jornada.id}`}>
        <h3 className="text-lg font-bold text-[#171717] mt-2 hover:underline">{jornada.titulo}</h3>
      </Link>
      <p className="text-sm text-[#525252] mt-1"> {jornada.lugar}, {jornada.ciudad}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        {jornada.Vacunas.map((v) => (
          <span key={v.id} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#525252]/10 text-[#525252]">
            {v.nombre}
          </span>
        ))}
      </div>

      <p className="text-sm text-[#171717] mt-3 line-clamp-2">{jornada.descripcion}</p>
      <p className="text-sm text-[#525252] mt-3">
        Organiza: <span className="font-semibold">{jornada.organizador}</span> · {jornada.cupos} cupos
      </p>

      <Link to={`/vacunacion/${jornada.id}`}>
        <Button variant="secondary" size="sm" fullWidth className="mt-4">
          Ver detalles
        </Button>
      </Link>

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
    </article>
  );
}
