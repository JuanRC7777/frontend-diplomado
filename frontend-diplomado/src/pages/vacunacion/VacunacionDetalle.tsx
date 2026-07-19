import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { JornadasContext } from "../../context/jornadas-context";
import { getJornada } from "../../lib/jornadas.api";
import type { Jornada } from "../../types";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";

export default function VacunacionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { eliminarJornada } = useContext(JornadasContext);
  const [jornada, setJornada] = useState<Jornada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getJornada(id)
      .then(setJornada)
      .catch(() => setError("No se encontró la jornada."))
      .finally(() => setLoading(false));
  }, [id]);

  //borra la jornada y vuelve al listado
  async function handleEliminar() {
    if (!jornada || !confirm("¿Seguro que quieres eliminar esta jornada?")) return;
    await eliminarJornada(jornada.id);
    navigate("/vacunacion");
  }

  if (loading) return <Loader label="Cargando jornada..." />;
  if (error || !jornada) {
    return (
      <div className="p-10">
        <Alert variant="error">{error || "Jornada no encontrada."}</Alert>
      </div>
    );
  }

  const esDueno = user?.id === jornada.usuario_id;

  return (
    <div className="p-10 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-[#525252]">
           {jornada.fecha} · {jornada.hora_inicio}–{jornada.hora_fin}
        </p>
        <h1 className="text-3xl font-bold text-[#171717] mt-2">{jornada.titulo}</h1>
        <p className="text-[#525252] mt-1"> {jornada.lugar}, {jornada.ciudad}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {jornada.Vacunas.map((v) => (
            <span key={v.id} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#525252]/10 text-[#525252]">
              {v.nombre}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[#171717]">{jornada.descripcion}</p>
        <p className="mt-4 text-sm text-[#525252]">
          Organiza: <span className="font-semibold">{jornada.organizador}</span> · {jornada.cupos} cupos
        </p>
        <p className="text-sm text-[#525252]">Contacto: {jornada.contacto_email}</p>

        {esDueno && (
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => navigate(`/vacunacion/${jornada.id}/editar`)}>
              Editar
            </Button>
            <Button variant="outline" onClick={handleEliminar}>
              Eliminar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
