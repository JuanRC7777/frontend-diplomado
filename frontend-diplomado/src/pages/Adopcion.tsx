import { useContext } from "react";
import { AdopcionesContext } from "../context/AdopcionesContext";

export default function Adopcion() {
  const { adopciones } = useContext(AdopcionesContext);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#264653]">Adopción</h1>
      <p>{adopciones.length} animales disponibles</p>
    </div>
  );
}