import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import FormField from "./FormField";
import Button from "./Button";
import Alert from "./Alert";
import Loader from "./Loader";
import { listVacunas } from "../lib/jornadas.api";
import type { JornadaInput } from "../lib/jornadas.api";
import type { Vacuna } from "../types";

export interface JornadaFormValues {
  titulo: string;
  lugar: string;
  ciudad: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  organizador: string;
  contacto_email: string;
  cupos: string;
  descripcion: string;
  vacunaIds: number[];
}

const FORM_VACIO: JornadaFormValues = {
  titulo: "",
  lugar: "",
  ciudad: "",
  fecha: "",
  hora_inicio: "",
  hora_fin: "",
  organizador: "",
  contacto_email: "",
  cupos: "",
  descripcion: "",
  vacunaIds: [],
};

const hoy = new Date().toISOString().split("T")[0];

interface JornadaFormProps {
  valoresIniciales?: JornadaFormValues;
  submitLabel: string;
  onSubmit: (datos: JornadaInput) => Promise<void>;
}

export default function JornadaForm({ valoresIniciales, submitLabel, onSubmit }: JornadaFormProps) {
  const [form, setForm] = useState<JornadaFormValues>(valoresIniciales ?? FORM_VACIO);
  const [catalogoVacunas, setCatalogoVacunas] = useState<Vacuna[]>([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorEnvio, setErrorEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  //  trae el catalogo de vacunas al montar
  useEffect(() => {
    listVacunas()
      .then(setCatalogoVacunas)
      .finally(() => setCargandoCatalogo(false));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrores((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  function toggleVacuna(id: number) {
    setForm((prev) => ({
      ...prev,
      vacunaIds: prev.vacunaIds.includes(id) ? prev.vacunaIds.filter((v) => v !== id) : [...prev.vacunaIds, id],
    }));
    setErrores((prev) => ({ ...prev, vacunas: "" }));
  }

  function validar() {
    const errs: Record<string, string> = {};
    if (!form.titulo.trim()) errs.titulo = "El título es requerido.";
    if (!form.lugar.trim()) errs.lugar = "El lugar es requerido.";
    if (!form.ciudad.trim()) errs.ciudad = "La ciudad es requerida.";
    if (!form.fecha) {
      errs.fecha = "La fecha es requerida.";
    } else if (form.fecha < hoy) {
      errs.fecha = "La fecha no puede ser anterior a hoy.";
    }
    if (!form.hora_inicio) errs.hora_inicio = "La hora de inicio es obligatoria.";
    if (!form.hora_fin) errs.hora_fin = "La hora de fin es obligatoria.";
    if (form.hora_inicio && form.hora_fin && form.hora_fin <= form.hora_inicio) {
      errs.hora_fin = "Debe ser posterior a la hora de inicio.";
    }
    if (!form.organizador.trim()) errs.organizador = "El organizador es requerido.";
    if (!form.contacto_email.trim()) {
      errs.contacto_email = "El correo es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contacto_email)) {
      errs.contacto_email = "Formato de correo inválido.";
    }
    if (!form.cupos.trim()) {
      errs.cupos = "Los cupos son requeridos.";
    } else if (isNaN(Number(form.cupos)) || Number(form.cupos) <= 0) {
      errs.cupos = "Debe ser un número mayor a 0.";
    }
    if (form.vacunaIds.length === 0) errs.vacunas = "Selecciona al menos una vacuna.";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      return;
    }

    setEnviando(true);
    setErrorEnvio("");
    try {
      await onSubmit({
        titulo: form.titulo,
        lugar: form.lugar,
        ciudad: form.ciudad,
        fecha: form.fecha,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        organizador: form.organizador,
        contacto_email: form.contacto_email,
        cupos: Number(form.cupos),
        descripcion: form.descripcion,
        vacunas: form.vacunaIds,
      });
    } catch {
      setErrorEnvio("No se pudo guardar la jornada. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] p-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      {errorEnvio && (
        <div className="sm:col-span-2">
          <Alert variant="error">{errorEnvio}</Alert>
        </div>
      )}

      <div className="sm:col-span-2">
        <FormField label="Título de la jornada" name="titulo" value={form.titulo} onChange={handleChange} error={errores.titulo} placeholder="Ej: Jornada Barrio Centro" />
      </div>
      <FormField label="Lugar / Dirección" name="lugar" value={form.lugar} onChange={handleChange} error={errores.lugar} placeholder="Ej: Parque Central, Calle 10" />
      <FormField label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} error={errores.ciudad} placeholder="Ej: Bogotá" />
      <FormField label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} error={errores.fecha} />
      <FormField label="Cupos" name="cupos" type="number" value={form.cupos} onChange={handleChange} error={errores.cupos} placeholder="Ej: 100" />
      <FormField label="Hora inicio" name="hora_inicio" type="time" value={form.hora_inicio} onChange={handleChange} error={errores.hora_inicio} />
      <FormField label="Hora fin" name="hora_fin" type="time" value={form.hora_fin} onChange={handleChange} error={errores.hora_fin} />
      <FormField label="Organizador" name="organizador" value={form.organizador} onChange={handleChange} error={errores.organizador} placeholder="Ej: Fundación Huellitas" />
      <FormField label="Correo de contacto" name="contacto_email" type="email" value={form.contacto_email} onChange={handleChange} error={errores.contacto_email} placeholder="contacto@correo.com" />
      <div className="sm:col-span-2">
        <FormField label="Descripción (opcional)" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Información adicional..." />
      </div>

      <div className="sm:col-span-2">
        <p className="text-sm font-semibold text-[#171717] mb-2">
          Vacunas disponibles <span className="text-black">*</span>
        </p>
        {cargandoCatalogo ? (
          <Loader label="Cargando catálogo de vacunas..." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {catalogoVacunas.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => toggleVacuna(v.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
                  form.vacunaIds.includes(v.id)
                    ? "bg-[#525252] border-[#525252] text-white"
                    : "bg-white border-[rgba(0,0,0,0.2)] text-[#525252] hover:border-[#525252]"
                }`}
              >
                {v.nombre}
              </button>
            ))}
          </div>
        )}
        {errores.vacunas && <span className="text-black font-semibold text-xs mt-1 block">{errores.vacunas}</span>}
      </div>

      <Button type="submit" variant="secondary" size="lg" fullWidth className="sm:col-span-2" disabled={enviando}>
        {enviando ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
