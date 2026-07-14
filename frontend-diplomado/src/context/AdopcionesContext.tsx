import { useState, type ReactNode } from "react";
import type { Animal } from "../types";
import adopcionesIniciales from "../data/adopciones.json";
import { AdopcionesContext } from "./adopciones-context";

export function AdopcionesProvider({ children }: { children: ReactNode }) {
  const [adopciones, setAdopciones] = useState<Animal[]>(adopcionesIniciales);

  function agregarAdopcion(animal: Animal) {
    setAdopciones((prev) => [animal, ...prev]);
  }

  return (
    <AdopcionesContext.Provider value={{ adopciones, agregarAdopcion }}>
      {children}
    </AdopcionesContext.Provider>
  );
}
