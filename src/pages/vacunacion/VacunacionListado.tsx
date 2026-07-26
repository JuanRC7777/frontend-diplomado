import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { JornadasContext } from "../../context/jornadas-context";
import { AuthContext } from "../../context/auth-context";
import CardJornada from "../../components/CardJornada";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";

export default function VacunacionListado() {
  const { jornadas, loading, error, eliminarJornada } = useContext(JornadasContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");

  const jornadasFiltradas = jornadas.filter(
    (j) =>
      j.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      j.ciudad.toLowerCase().includes(filtro.toLowerCase()) ||
      j.organizador.toLowerCase().includes(filtro.toLowerCase())
  );

  async function handleEliminar(id: number) {
    if (!confirm("¿Seguro que quieres eliminar esta jornada?")) return;
    await eliminarJornada(id);
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-[#171717]">Vacunación</h1>
        <Link to="/vacunacion/crear">
          <Button variant="secondary">➕ Publicar jornada</Button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por título, ciudad u organizador..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full sm:w-96 px-4 py-2.5 mt-6 rounded-lg border border-[rgba(0,0,0,0.2)] bg-white focus:outline-none focus:ring-2 focus:ring-[#525252]"
      />

      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader label="Cargando jornadas..." />
      ) : (
        <>
          <p className="text-sm text-[#525252] mt-4">{jornadasFiltradas.length} jornadas disponibles</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {jornadasFiltradas.map((j) => (
              <CardJornada
                key={j.id}
                jornada={j}
                onEditar={user?.id === j.usuario_id ? () => navigate(`/vacunacion/${j.id}/editar`) : undefined}
                onEliminar={user?.id === j.usuario_id ? () => handleEliminar(j.id) : undefined}
              />
            ))}
          </div>

          {jornadasFiltradas.length === 0 && (
            <div className="text-center py-20 text-[#525252]">
              <p className="text-5xl mb-4">💉</p>
              <p className="text-lg font-semibold">No se encontraron jornadas.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
