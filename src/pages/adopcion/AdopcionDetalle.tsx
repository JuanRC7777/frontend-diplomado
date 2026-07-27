import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { AdopcionesContext } from "../../context/adopciones-context";
import { getAnimal } from "../../lib/animales.api";
import { crearSolicitud } from "../../lib/solicitudes.api";
import { ApiError } from "../../lib/api";
import type { Animal } from "../../types";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import { resolverFoto } from "../../lib/api";

const SOLICITUD_INICIAL = { nombre_solicitante: "", telefono_solicitante: "", email_solicitante: "", mensaje: "" };

export default function AdopcionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { eliminarAnimal } = useContext(AdopcionesContext);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formSolicitud, setFormSolicitud] = useState(SOLICITUD_INICIAL);
  const [erroresSolicitud, setErroresSolicitud] = useState<Record<string, string>>({});
  const [mensajeExito, setMensajeExito] = useState("");
  const [enviando, setEnviando] = useState(false);

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

  function handleChangeSolicitud(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormSolicitud((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErroresSolicitud((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  function validarSolicitud() {
    const errs: Record<string, string> = {};
    if (!formSolicitud.nombre_solicitante.trim()) errs.nombre_solicitante = "El nombre es requerido.";
    if (!formSolicitud.telefono_solicitante.trim()) errs.telefono_solicitante = "El teléfono es requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formSolicitud.email_solicitante)) {
      errs.email_solicitante = "Formato de correo inválido.";
    }
    return errs;
  }

  async function handleSubmitSolicitud(e: React.FormEvent) {
    e.preventDefault();
    if (!animal) return;

    const errs = validarSolicitud();
    if (Object.keys(errs).length > 0) {
      setErroresSolicitud(errs);
      return;
    }

    setEnviando(true);
    try {
      await crearSolicitud({ animal_id: animal.id, ...formSolicitud });
      setMensajeExito("¡Solicitud enviada! Te contactarán pronto.");
      setFormSolicitud(SOLICITUD_INICIAL);
      setMostrarFormulario(false);
    } catch (err) {
      setErroresSolicitud({
        nombre_solicitante: err instanceof ApiError ? err.message : "No se pudo enviar la solicitud.",
      });
    } finally {
      setEnviando(false);
    }
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

          {mensajeExito && (
            <div className="mt-4">
              <Alert variant="success">{mensajeExito}</Alert>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {!mostrarFormulario && (
              <Button variant="primary" onClick={() => { setMostrarFormulario(true); setMensajeExito(""); }}>
                Quiero adoptarlo
              </Button>
            )}
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

          {mostrarFormulario && (
            <form
              onSubmit={handleSubmitSolicitud}
              className="mt-6 border border-[rgba(0,0,0,0.1)] rounded-xl p-6 flex flex-col gap-4"
            >
              <h2 className="font-bold text-[#171717]">Solicitar información de adopción</h2>
              <FormField
                label="Tu nombre"
                name="nombre_solicitante"
                value={formSolicitud.nombre_solicitante}
                onChange={handleChangeSolicitud}
                error={erroresSolicitud.nombre_solicitante}
                placeholder="Ej: María García"
              />
              <FormField
                label="Tu teléfono"
                name="telefono_solicitante"
                type="tel"
                value={formSolicitud.telefono_solicitante}
                onChange={handleChangeSolicitud}
                error={erroresSolicitud.telefono_solicitante}
                placeholder="Ej: 300 123 4567"
              />
              <FormField
                label="Tu correo"
                name="email_solicitante"
                type="email"
                value={formSolicitud.email_solicitante}
                onChange={handleChangeSolicitud}
                error={erroresSolicitud.email_solicitante}
                placeholder="tu@correo.com"
              />
              <FormField
                label="Mensaje (opcional)"
                name="mensaje"
                value={formSolicitud.mensaje}
                onChange={handleChangeSolicitud}
                placeholder="Cuéntanos por qué te gustaría adoptarlo..."
              />
              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={enviando}>
                  {enviando ? "Enviando..." : "Enviar solicitud"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
