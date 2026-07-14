import type { Jornada } from "../types";
import Button from "./Button";

export default function CardJornada({ jornada }: { jornada: Jornada }) {
  return (
<<<<<<< Updated upstream
    <article className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] p-5 hover:shadow-lg transition-shadow duration-200">
      <p className="text-xs font-bold uppercase tracking-wide text-[#525252]">
         {jornada.fecha} · {jornada.hora}–{jornada.horaFin}
      </p>
      <h3 className="text-lg font-bold text-[#171717] mt-2">{jornada.titulo}</h3>
      <p className="text-sm text-[#525252] mt-1"> {jornada.lugar}, {jornada.ciudad}</p>
=======
    <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-shadow duration-200">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
         {jornada.fecha} · {jornada.hora}–{jornada.horaFin}
      </p>
      <h3 className="text-lg font-bold text-slate-900 mt-2">{jornada.titulo}</h3>
      <p className="text-slate-500 mt-1"> {jornada.lugar}, {jornada.ciudad}</p>
>>>>>>> Stashed changes

      <div className="flex flex-wrap gap-2 mt-3">
        {jornada.vacunas.map((v) => (
          <span key={v} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#525252]/10 text-[#525252]">
            {v}
          </span>
        ))}
      </div>

<<<<<<< Updated upstream
      <p className="text-sm text-[#171717] mt-3 line-clamp-2">{jornada.descripcion}</p>
      <p className="text-sm text-[#525252] mt-3">
=======
      <p className="text-sm text-slate-900 mt-3 line-clamp-2">{jornada.descripcion}</p>
      <p className="text-sm text-slate-500 mt-3">
>>>>>>> Stashed changes
        Organiza: <span className="font-semibold">{jornada.organizador}</span> · {jornada.cupos} cupos
      </p>

      <Button variant="secondary" size="sm" fullWidth className="mt-4">
        Ver detalles
      </Button>
    </article>
  );
}