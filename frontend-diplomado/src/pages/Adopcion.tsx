import { useContext, useState } from "react";
import { AdopcionesContext } from "../context/AdopcionesContext";
import Card from "../components/Card";

export default function Adopcion() {
  const { adopciones } = useContext(AdopcionesContext);
  const [filtro, setFiltro] = useState("");

  const adopcionesFiltradas = adopciones.filter(
    (a) =>
      a.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      a.raza.toLowerCase().includes(filtro.toLowerCase()) ||
      a.ciudad.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#264653]">Adopción</h1>

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
    </div>
  );
}