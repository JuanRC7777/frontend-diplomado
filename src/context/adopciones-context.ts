import { createContext } from "react";
import type { Animal } from "../types";
import type { AnimalInput } from "../lib/animales.api";

export interface AdopcionesContextType {
  adopciones: Animal[];
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  crearAnimal: (datos: AnimalInput, foto: File | null) => Promise<Animal>;
  editarAnimal: (id: number, datos: AnimalInput, foto: File | null) => Promise<Animal>;
  eliminarAnimal: (id: number) => Promise<void>;
}

// valores por defecto, se sobreescriben
export const AdopcionesContext = createContext<AdopcionesContextType>({
  adopciones: [],
  loading: true,
  error: null,
  recargar: async () => {},
  crearAnimal: async () => {
    throw new Error("No inicializado.");
  },
  editarAnimal: async () => {
    throw new Error("No inicializado.");
  },
  eliminarAnimal: async () => {},
});
