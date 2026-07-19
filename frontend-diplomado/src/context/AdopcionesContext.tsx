import { useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Animal } from "../types";
import { listAnimales, createAnimal, updateAnimal, deleteAnimal, type AnimalInput } from "../lib/animales.api";
import { AdopcionesContext } from "./adopciones-context";
import { AuthContext } from "./auth-context";

export function AdopcionesProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useContext(AuthContext);
  const [adopciones, setAdopciones] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      const datos = await listAnimales();
      setAdopciones(datos);
      setError(null);
    } catch {
      setError("No se pudo cargar el listado de adopción.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  async function crearAnimal(datos: AnimalInput, foto: File | null) {
    const nuevo = await createAnimal(datos, foto, accessToken);
    await recargar();
    return nuevo;
  }

  async function editarAnimal(id: number, datos: AnimalInput, foto: File | null) {
    const actualizado = await updateAnimal(id, datos, foto, accessToken);
    await recargar();
    return actualizado;
  }

  // borra y recargar el listado
  async function eliminarAnimal(id: number) {
    await deleteAnimal(id, accessToken);
    await recargar();
  }

  return (
    <AdopcionesContext.Provider
      value={{ adopciones, loading, error, recargar, crearAnimal, editarAnimal, eliminarAnimal }}
    >
      {children}
    </AdopcionesContext.Provider>
  );
}
