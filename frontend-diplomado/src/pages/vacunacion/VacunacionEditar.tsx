import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JornadasContext } from "../../context/jornadas-context";
import { getJornada } from "../../lib/jornadas.api";
import JornadaForm, { type JornadaFormValues } from "../../components/JornadaForm";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import type { JornadaInput } from "../../lib/jornadas.api";

export default function VacunacionEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editarJornada } = useContext(JornadasContext);
  const [valoresIniciales, setValoresIniciales] = useState<JornadaFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // trae la jornada y la deja lista para el formulario
  useEffect(() => {
    if (!id) return;
    getJornada(id)
      .then((jornada) =>
        setValoresIniciales({
          titulo: jornada.titulo,
          lugar: jornada.lugar,
          ciudad: jornada.ciudad,
          fecha: jornada.fecha,
          hora_inicio: jornada.hora_inicio,
          hora_fin: jornada.hora_fin,
          organizador: jornada.organizador,
          contacto_email: jornada.contacto_email,
          cupos: String(jornada.cupos),
          descripcion: jornada.descripcion ?? "",
          vacunaIds: jornada.Vacunas.map((v) => v.id),
        })
      )
      .catch(() => setError("No se pudo cargar la jornada."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(datos: JornadaInput) {
    if (!id) return;
    await editarJornada(Number(id), datos);
    setMensajeExito("¡Cambios guardados! Redirigiendo...");
    setTimeout(() => navigate(`/vacunacion/${id}`), 1200);
  }

  if (loading) return <Loader label="Cargando jornada..." />;
  if (error || !valoresIniciales) {
    return (
      <div className="p-10">
        <Alert variant="error">{error || "Jornada no encontrada."}</Alert>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#171717]">Editar jornada</h1>
      {mensajeExito && (
        <Alert variant="success" className="mt-6 max-w-2xl">
          {mensajeExito}
        </Alert>
      )}
      <div className="mt-6">
        <JornadaForm valoresIniciales={valoresIniciales} submitLabel="Guardar cambios" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
