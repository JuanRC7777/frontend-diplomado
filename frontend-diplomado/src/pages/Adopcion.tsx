import { useContext, useState } from "react";
import { AdopcionesContext } from "../context/AdopcionesContext";
import Card from "../components/Card";
import FormField from "../components/FormField";

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
};

export default function Adopcion() {
  /* 2. Estados */
  const { adopciones } = useContext(AdopcionesContext);
  const [pestana, setPestana] = useState<"consulta" | "registro">("consulta");
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState(FORM_INICIAL);

  /* 3. Un solo onChange para todos los campos */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* 4. Lista filtrada por el buscador */
  const adopcionesFiltradas = adopciones.filter(
    (a) =>
      a.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      a.raza.toLowerCase().includes(filtro.toLowerCase()) ||
      a.ciudad.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#264653]">Adopción</h1>

      {/* 5. Pestañas */}
      <div className="flex gap-2 mt-6 border-b border-[rgba(38,70,83,0.15)]">
        <button
          onClick={() => setPestana("consulta")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 ${
            pestana === "consulta"
              ? "border-[#F4A261] text-[#264653]"
              : "border-transparent text-[#6B675F]"
          }`}
        >
          🔍 Consultar
        </button>
        <button
          onClick={() => setPestana("registro")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 ${
            pestana === "registro"
              ? "border-[#F4A261] text-[#264653]"
              : "border-transparent text-[#6B675F]"
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
            className="w-full sm:w-96 px-4 py-2.5 mt-6 rounded-lg border border-[rgba(38,70,83,0.2)] bg-white focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
          />

          <p className="text-sm text-[#6B675F] mt-4">
            {adopcionesFiltradas.length} animales disponibles
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {adopcionesFiltradas.map((a) => (
              <Card key={a.id} animal={a} />
            ))}
          </div>

          {adopcionesFiltradas.length === 0 && (
            <div className="text-center py-20 text-[#6B675F]">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold">No se encontraron resultados.</p>
            </div>
          )}
        </>
      )}

      {/* 7. PESTAÑA REGISTRO: el formulario */}
      {pestana === "registro" && (
        <form className="max-w-2xl mt-6 bg-white rounded-2xl shadow-sm border border-[rgba(38,70,83,0.1)] p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Nombre del animal" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Mango" />
          <FormField
            label="Especie"
            name="especie"
            value={form.especie}
            onChange={handleChange}
            options={[
              { value: "Perro", label: "Perro" },
              { value: "Gato", label: "Gato" },
              { value: "Otro", label: "Otro" },
            ]}
          />
          <FormField label="Raza" name="raza" value={form.raza} onChange={handleChange} placeholder="Ej: Criollo" />
          <FormField label="Edad (años)" name="edad" type="number" value={form.edad} onChange={handleChange} placeholder="Ej: 2" />
          <FormField
            label="Tamaño"
            name="tamano"
            value={form.tamano}
            onChange={handleChange}
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
            options={[
              { value: "Macho", label: "Macho" },
              { value: "Hembra", label: "Hembra" },
            ]}
          />
          <FormField label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ej: Bogotá" />
          <FormField label="URL de foto (opcional)" name="foto" value={form.foto} onChange={handleChange} placeholder="https://..." />
          <FormField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Personalidad, necesidades..." />
          <FormField label="Correo de contacto" name="contacto" type="email" value={form.contacto} onChange={handleChange} placeholder="tu@correo.com" />
          <FormField label="Teléfono" name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="Ej: 300 123 4567" />

          <button
            type="submit"
            className="sm:col-span-2 bg-[#264653] text-white font-semibold py-3 rounded-lg hover:bg-[#1b3540]"
          >
            Publicar en adopción
          </button>
        </form>
      )}
    </div>
  );
}