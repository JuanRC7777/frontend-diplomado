import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdopcionesContext } from "../../context/adopciones-context";
import { AuthContext } from "../../context/auth-context";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";

export default function AdopcionListado() {
  const { adopciones, loading, error, eliminarAnimal } = useContext(AdopcionesContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");

  const adopcionesFiltradas = adopciones.filter(
    (a) =>
      a.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      a.raza.toLowerCase().includes(filtro.toLowerCase()) ||
      a.ciudad.toLowerCase().includes(filtro.toLowerCase())
  );

  async function handleEliminar(id: number) {
    if (!confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    await eliminarAnimal(id);
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-[#171717]">Adopción</h1>
        <Link to="/adopcion/crear">
          <Button variant="primary">➕ Publicar animal</Button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, raza o ciudad..."
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
        <Loader label="Cargando animales..." />
      ) : (
        <>
          <p className="text-sm text-[#525252] mt-4">{adopcionesFiltradas.length} animales disponibles</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {adopcionesFiltradas.map((a) => (
              <Card
                key={a.id}
                animal={a}
                onEditar={user?.id === a.usuario_id ? () => navigate(`/adopcion/${a.id}/editar`) : undefined}
                onEliminar={user?.id === a.usuario_id ? () => handleEliminar(a.id) : undefined}
              />
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
    </div>
  );
}
