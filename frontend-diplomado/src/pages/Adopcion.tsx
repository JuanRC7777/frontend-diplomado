import { useContext } from "react";
import { AdopcionesContext } from "../context/AdopcionesContext";
import Card from "../components/Card";

export default function Adopcion() {
  const { adopciones } = useContext(AdopcionesContext);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#264653]">Adopción</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {adopciones.map((a) => (
          <Card key={a.id} animal={a} />
        ))}
      </div>
    </div>
  );
}