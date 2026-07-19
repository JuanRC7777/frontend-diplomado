import { useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Jornada } from "../types";
import { listJornadas, createJornada, updateJornada, deleteJornada, type JornadaInput } from "../lib/jornadas.api";
import { JornadasContext } from "./jornadas-context";
import { AuthContext } from "./auth-context";

export function JornadasProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useContext(AuthContext);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      const datos = await listJornadas();
      setJornadas(datos);
      setError(null);
    } catch {
      setError("No se pudo cargar el listado de jornadas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  async function crearJornada(datos: JornadaInput) {
    const nueva = await createJornada(datos, accessToken);
    await recargar();
    return nueva;
  }

  async function editarJornada(id: number, datos: JornadaInput) {
    const actualizada = await updateJornada(id, datos, accessToken);
    await recargar();
    return actualizada;
  }

  // igualmente borra y recarga
  async function eliminarJornada(id: number) {
    await deleteJornada(id, accessToken);
    await recargar();
  }

  return (
    <JornadasContext.Provider
      value={{ jornadas, loading, error, recargar, crearJornada, editarJornada, eliminarJornada }}
    >
      {children}
    </JornadasContext.Provider>
  );
}
