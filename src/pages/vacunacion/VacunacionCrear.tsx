import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JornadasContext } from "../../context/jornadas-context";
import JornadaForm from "../../components/JornadaForm";
import Alert from "../../components/Alert";
import type { JornadaInput } from "../../lib/jornadas.api";

export default function VacunacionCrear() {
  const { crearJornada } = useContext(JornadasContext);
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState("");

  async function handleSubmit(datos: JornadaInput) {
    await crearJornada(datos);
    setMensajeExito("¡Jornada publicada! Redirigiendo al listado...");
    setTimeout(() => navigate("/vacunacion"), 1200);
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#171717]">Publicar jornada de vacunación</h1>
      {mensajeExito && (
        <Alert variant="success" className="mt-6 max-w-2xl">
          {mensajeExito}
        </Alert>
      )}
      <div className="mt-6">
        <JornadaForm submitLabel="Publicar jornada" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
