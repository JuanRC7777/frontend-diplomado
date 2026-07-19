import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { AdopcionesContext } from "../../context/adopciones-context";
import { getAnimal } from "../../lib/animales.api";
import type { Animal } from "../../types";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import { resolverFoto } from "../../lib/api";

export default function AdopcionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { eliminarAnimal } = useContext(AdopcionesContext);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getAnimal(id)
      .then(setAnimal)
      .catch(() => setError("No se encontró el animal."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleEliminar() {
    if (!animal || !confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    await eliminarAnimal(animal.id);
    navigate("/adopcion");
  }

  if (loading) return <Loader label="Cargando animal..." />;
  if (error || !animal) {
    return (
      <div className="p-10">
        <Alert variant="error">{error || "Animal no encontrado."}</Alert>
      </div>
    );
  }

  const esDueno = user?.id === animal.usuario_id;

  return (
    <div className="p-10 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] overflow-hidden">
        <img
          src={resolverFoto(animal.foto_url) || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800"}
          alt={animal.nombre}
          className="w-full h-72 object-cover"
        />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-[#171717]">{animal.nombre}</h1>
          <p className="text-[#525252] mt-1">
            {animal.especie} · {animal.raza} · {animal.edad} {animal.unidad_edad} · {animal.sexo} · {animal.tamano}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {animal.vacunado && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-200 text-black">✓ Vacunado</span>
            )}
            {animal.esterilizado && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-200 text-black">✓ Esterilizado</span>
            )}
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold border border-black text-black">
              {animal.estado_salud}
            </span>
          </div>

          <p className="mt-4 text-[#171717]">{animal.descripcion}</p>
          <p className="mt-4 text-sm text-[#525252]"> {animal.ciudad}</p>
          <p className="text-sm text-[#525252]">
            Contacto: {animal.contacto_email} · {animal.contacto_telefono}
          </p>

          <div className="flex gap-3 mt-6">
            <Button variant="primary" onClick={() => window.open(`mailto:${animal.contacto_email}`)}>
              Quiero adoptarlo
            </Button>
            {esDueno && (
              <>
                <Button variant="outline" onClick={() => navigate(`/adopcion/${animal.id}/editar`)}>
                  Editar
                </Button>
                <Button variant="outline" onClick={handleEliminar}>
                  Eliminar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
