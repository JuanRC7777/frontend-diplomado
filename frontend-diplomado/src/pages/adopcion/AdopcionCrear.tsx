import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdopcionesContext } from "../../context/adopciones-context";
import AnimalForm from "../../components/AnimalForm";
import Alert from "../../components/Alert";
import type { AnimalInput } from "../../lib/animales.api";

export default function AdopcionCrear() {
  const { crearAnimal } = useContext(AdopcionesContext);
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState("");

  // crea el animal y redirige
  async function handleSubmit(datos: AnimalInput, foto: File | null) {
    await crearAnimal(datos, foto);
    setMensajeExito("¡Publicación creada! Redirigiendo al listado...");
    setTimeout(() => navigate("/adopcion"), 1200);
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#171717]">Publicar animal en adopción</h1>
      {mensajeExito && (
        <Alert variant="success" className="mt-6 max-w-2xl">
          {mensajeExito}
        </Alert>
      )}
      <div className="mt-6">
        <AnimalForm submitLabel="Publicar en adopción" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
