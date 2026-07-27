import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { listarSolicitudes } from "../lib/solicitudes.api";
import { ApiError } from "../lib/api";
import type { SolicitudAdopcion } from "../types";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

export default function Admin() {
  const { accessToken } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listarSolicitudes(accessToken)
      .then(setSolicitudes)
      .catch((err) => setError(err instanceof ApiError ? err.message : "No se pudieron cargar las solicitudes."))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#171717]">Panel de administración</h1>

      {/* unica pestaña por ahora, se puede agregar mas despues */}
      <div className="flex gap-2 mt-6 border-b border-[rgba(0,0,0,0.15)]">
        <span className="px-6 py-3 text-sm font-semibold border-b-2 border-black text-[#171717]">
          📋 Solicitudes de adopción
        </span>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Cargando solicitudes..." />
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : solicitudes.length === 0 ? (
          <p className="text-sm text-[#525252]">Aún no hay solicitudes de adopción.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-100 text-[#525252]">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Animal</th>
                  <th className="p-3">Solicitante</th>
                  <th className="p-3">Contacto</th>
                  <th className="p-3">Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id} className="border-t border-[rgba(0,0,0,0.08)] align-top">
                    <td className="p-3 text-[#525252] whitespace-nowrap">
                      {new Date(s.fecha_solicitud).toLocaleDateString("es-CO")}
                    </td>
                    <td className="p-3 font-semibold text-[#171717]">
                      {s.Animal ? (
                        <Link to={`/adopcion/${s.Animal.id}`} className="hover:underline">
                          {s.Animal.nombre}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 text-[#171717]">{s.nombre_solicitante}</td>
                    <td className="p-3 text-[#525252]">
                      {s.telefono_solicitante}
                      <br />
                      {s.email_solicitante}
                    </td>
                    <td className="p-3 text-[#525252] max-w-xs">{s.mensaje || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
