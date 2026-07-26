import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdopcionesContext } from "../../context/adopciones-context";
import { getAnimal } from "../../lib/animales.api";
import AnimalForm, { type AnimalFormValues } from "../../components/AnimalForm";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import type { AnimalInput } from "../../lib/animales.api";

export default function AdopcionEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editarAnimal } = useContext(AdopcionesContext);
  const [valoresIniciales, setValoresIniciales] = useState<AnimalFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    if (!id) return;
    getAnimal(id)
      .then((animal) =>
        setValoresIniciales({
          nombre: animal.nombre,
          especie: animal.especie,
          raza: animal.raza,
          edad: String(animal.edad),
          tamano: animal.tamano,
          sexo: animal.sexo,
          ciudad: animal.ciudad,
          descripcion: animal.descripcion ?? "",
          contacto_email: animal.contacto_email,
          contacto_telefono: animal.contacto_telefono,
          vacunado: animal.vacunado ? "si" : "no",
          fotoActual: animal.foto_url,
        })
      )
      .catch(() => setError("No se pudo cargar el animal."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(datos: AnimalInput, foto: File | null) {
    if (!id) return;
    await editarAnimal(Number(id), datos, foto);
    setMensajeExito("¡Cambios guardados! Redirigiendo...");
    setTimeout(() => navigate(`/adopcion/${id}`), 1200);
  }

  if (loading) return <Loader label="Cargando animal..." />;
  if (error || !valoresIniciales) {
    return (
      <div className="p-10">
        <Alert variant="error">{error || "Animal no encontrado."}</Alert>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#171717]">Editar publicación</h1>
      {mensajeExito && (
        <Alert variant="success" className="mt-6 max-w-2xl">
          {mensajeExito}
        </Alert>
      )}
      <div className="mt-6">
        <AnimalForm valoresIniciales={valoresIniciales} submitLabel="Guardar cambios" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
