import { createContext } from "react";
import type { Animal } from "../types";

export interface AdopcionesContextType {
  adopciones: Animal[];
  agregarAdopcion: (animal: Animal) => void;
}

export const AdopcionesContext = createContext<AdopcionesContextType>({
  adopciones: [],
  agregarAdopcion: () => {},
});
