import { useContext, useState } from "react";
import { AdopcionesContext } from "../context/AdopcionesContext";
import Card from "../components/Card";
import FormField from "../components/FormField";
import type { Animal } from "../types";

/* 1. Molde vacío del formulari */
const FORM_INICIAL = {
  nombre: "",
  especie: "",
  raza: "",
  edad: "",
  tamano: "",
  sexo: "",
  ciudad: "",
  descripcion: "",
  foto: "",
  contacto: "",
  telefono: "",
  vacunado: "no",
};

export default function Adopcion() {
  /* 2. Estados */
  const { adopciones, agregarAdopcion } = useContext(AdopcionesContext);
  const [pestana, setPestana] = useState<"consulta" | "registro">("consulta");
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [mensajeExito, setMensajeExito] = useState("");

  /* 3. Un solo onChange para todos los campos */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrores((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // Funcion de validacion 
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
    if (!form.contacto.trim()) {
      errs.contacto = "El correo es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contacto)) {
      errs.contacto = "Formato de correo inválido.";
    }
    if (!form.telefono.trim()) errs.telefono = "El teléfono es requerido.";
    return errs;
  }

  //Funcion de handleSubmit
    function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs = validar();
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      return;
    }

    const nuevo: Animal = {
      id: Date.now(),
      nombre: form.nombre,
      especie: form.especie,
      raza: form.raza,
      edad: Number(form.edad),
      unidadEdad: "años",
      tamano: form.tamano,
      sexo: form.sexo,
      estadoSalud: "Buena",
      vacunado: form.vacunado === "si",
      esterilizado: false,
      descripcion: form.descripcion,
      foto: form.foto || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
      ciudad: form.ciudad,
      contacto: form.contacto,
      telefono: form.telefono,
      fecha_publicacion: new Date().toISOString().split("T")[0],
    };

    agregarAdopcion(nuevo);
    setMensajeExito("¡Publicación creada! Ya aparece en el listado.");
    setForm(FORM_INICIAL);
    setErrores({});

    setTimeout(() => {
      setMensajeExito("");
      setPestana("consulta");
    }, 2000);
  }


  /* 4. Lista filtrada por el buscador */
  const adopcionesFiltradas = adopciones.filter(
    (a) =>
      a.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      a.raza.toLowerCase().includes(filtro.toLowerCase()) ||
      a.ciudad.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#171717]">Adopción</h1>

      {/* 5. Pestañas */}
      <div className="flex gap-2 mt-6 border-b border-[rgba(0,0,0,0.15)]">
        <button
          onClick={() => setPestana("consulta")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 ${
            pestana === "consulta"
              ? "border-black text-[#171717]"
              : "border-transparent text-[#525252]"
          }`}
        >
          🔍 Consultar
        </button>
        <button
          onClick={() => setPestana("registro")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 ${
            pestana === "registro"
              ? "border-black text-[#171717]"
              : "border-transparent text-[#525252]"
          }`}
        >
          ➕ Publicar animal
        </button>
      </div>

      {/* 6. PESTAÑA CONSULTA */}
      {pestana === "consulta" && (
        <>
          <input
            type="text"
            placeholder="Buscar por nombre, raza o ciudad..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full sm:w-96 px-4 py-2.5 mt-6 rounded-lg border border-[rgba(0,0,0,0.2)] bg-white focus:outline-none focus:ring-2 focus:ring-[#525252]"
          />

          <p className="text-sm text-[#525252] mt-4">
            {adopcionesFiltradas.length} animales disponibles
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {adopcionesFiltradas.map((a) => (
              <Card key={a.id} animal={a} />
            ))}
          </div>

          {adopcionesFiltradas.length === 0 && (
            <div className="text-center py-20 text-[#525252]">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold">No se encontraron resultados.</p>
            </div>
          )}
        </>
      )}

            {/* 7. PESTAÑA REGISTRO: el formulario */}
      {pestana === "registro" && (
        <>
          {mensajeExito && (
            <div className="max-w-2xl mt-6 p-4 bg-neutral-100 border border-neutral-300 rounded-lg text-black font-semibold">
              ✅ {mensajeExito}
            </div>
          )}
          <form onSubmit={handleSubmit} className="max-w-2xl mt-6 bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <FormField label="Correo de contacto" name="contacto" type="email" value={form.contacto} onChange={handleChange} error={errores.contacto} placeholder="tu@correo.com" />
            <FormField label="Teléfono" name="telefono" type="tel" value={form.telefono} onChange={handleChange} error={errores.telefono} placeholder="Ej: 300 123 4567" />
            <FormField label="URL de foto (opcional)" name="foto" value={form.foto} onChange={handleChange} placeholder="https://..." />
            <FormField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Personalidad, necesidades..." />

            <button
              type="submit"
              className="sm:col-span-2 bg-[#171717] text-white font-semibold py-3 rounded-lg hover:bg-[#000000]"
            >
              Publicar en adopción
            </button>
          </form>
        </>
      )}
    </div>
  );
}