import { useState, type ChangeEvent, type FormEvent } from "react";
import FormField from "./FormField";
import Button from "./Button";
import Alert from "./Alert";
import { resolverFoto } from "../lib/api";
import type { AnimalInput } from "../lib/animales.api";

export interface AnimalFormValues {
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  tamano: string;
  sexo: string;
  ciudad: string;
  descripcion: string;
  contacto_email: string;
  contacto_telefono: string;
  vacunado: string;
  fotoActual?: string | null;
}

const FORM_VACIO: AnimalFormValues = {
  nombre: "",
  especie: "",
  raza: "",
  edad: "",
  tamano: "",
  sexo: "",
  ciudad: "",
  descripcion: "",
  contacto_email: "",
  contacto_telefono: "",
  vacunado: "no",
};

interface AnimalFormProps {
  valoresIniciales?: AnimalFormValues;
  submitLabel: string;
  onSubmit: (datos: AnimalInput, foto: File | null) => Promise<void>;
}

export default function AnimalForm({ valoresIniciales, submitLabel, onSubmit }: AnimalFormProps) {
  const [form, setForm] = useState<AnimalFormValues>(valoresIniciales ?? FORM_VACIO);
  const [foto, setFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(
    resolverFoto(valoresIniciales?.fotoActual)
  );
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorEnvio, setErrorEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrores((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // cuando cambia el input de la foto
  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0] ?? null;
    setFoto(archivo);
    setPreviewFoto(archivo ? URL.createObjectURL(archivo) : resolverFoto(valoresIniciales?.fotoActual));
  }

  function validar() {
    const errs: Record<string, string> = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es requerido.";
    if (!form.especie) errs.especie = "Selecciona la especie.";
    if (!form.raza.trim()) errs.raza = "La raza es requerida.";
    if (!form.edad.trim()) {
      errs.edad = "La edad es requerida.";
    } else if (isNaN(Number(form.edad)) || Number(form.edad) < 0) {
      errs.edad = "Debe ser un número válido.";
    }
    if (!form.tamano) errs.tamano = "El tamaño es requerido.";
    if (!form.sexo) errs.sexo = "El sexo es requerido.";
    if (!form.ciudad.trim()) errs.ciudad = "La ciudad es requerida.";
    if (!form.contacto_email.trim()) {
      errs.contacto_email = "El correo es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contacto_email)) {
      errs.contacto_email = "Formato de correo inválido.";
    }
    if (!form.contacto_telefono.trim()) errs.contacto_telefono = "El teléfono es requerido.";
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
      await onSubmit(
        {
          nombre: form.nombre,
          especie: form.especie,
          raza: form.raza,
          edad: Number(form.edad),
          unidad_edad: "años",
          tamano: form.tamano as AnimalInput["tamano"],
          sexo: form.sexo as AnimalInput["sexo"],
          vacunado: form.vacunado === "si",
          esterilizado: false,
          descripcion: form.descripcion,
          ciudad: form.ciudad,
          contacto_email: form.contacto_email,
          contacto_telefono: form.contacto_telefono,
        },
        foto
      );
    } catch {
      setErrorEnvio("No se pudo guardar el animal. Intenta de nuevo.");
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

      <FormField label="Nombre del animal" name="nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} placeholder="Ej: Mango" />
      <FormField
        label="Especie"
        name="especie"
        value={form.especie}
        onChange={handleChange}
        error={errores.especie}
        options={[
          { value: "Perro", label: "Perro" },
          { value: "Gato", label: "Gato" },
          { value: "Otro", label: "Otro" },
        ]}
      />
      <FormField label="Raza" name="raza" value={form.raza} onChange={handleChange} error={errores.raza} placeholder="Ej: Criollo" />
      <FormField label="Edad (años)" name="edad" type="number" value={form.edad} onChange={handleChange} error={errores.edad} placeholder="Ej: 2" />
      <FormField
        label="Tamaño"
        name="tamano"
        value={form.tamano}
        onChange={handleChange}
        error={errores.tamano}
        options={[
          { value: "Pequeño", label: "Pequeño" },
          { value: "Mediano", label: "Mediano" },
          { value: "Grande", label: "Grande" },
        ]}
      />
      <FormField
        label="Sexo"
        name="sexo"
        value={form.sexo}
        onChange={handleChange}
        error={errores.sexo}
        options={[
          { value: "Macho", label: "Macho" },
          { value: "Hembra", label: "Hembra" },
        ]}
      />
      <FormField
        label="¿Vacunado?"
        name="vacunado"
        value={form.vacunado}
        onChange={handleChange}
        options={[
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ]}
      />
      <FormField label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} error={errores.ciudad} placeholder="Ej: Bogotá" />
      <FormField label="Correo de contacto" name="contacto_email" type="email" value={form.contacto_email} onChange={handleChange} error={errores.contacto_email} placeholder="tu@correo.com" />
      <FormField label="Teléfono" name="contacto_telefono" type="tel" value={form.contacto_telefono} onChange={handleChange} error={errores.contacto_telefono} placeholder="Ej: 300 123 4567" />

      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-[#171717] mb-1">Foto (opcional)</label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFotoChange}
          className="w-full px-4 py-2.5 rounded-lg border border-[rgba(0,0,0,0.2)] bg-white text-sm"
        />
        {previewFoto && (
          <img src={previewFoto} alt="Vista previa" className="mt-3 w-32 h-32 object-cover rounded-lg border border-[rgba(0,0,0,0.1)]" />
        )}
      </div>

      <div className="sm:col-span-2">
        <FormField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Personalidad, necesidades..." />
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth className="sm:col-span-2" disabled={enviando}>
        {enviando ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
