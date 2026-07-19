import { createContext } from "react";
import type { Jornada } from "../types";
import type { JornadaInput } from "../lib/jornadas.api";

export interface JornadasContextType {
  jornadas: Jornada[];
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  crearJornada: (datos: JornadaInput) => Promise<Jornada>;
  editarJornada: (id: number, datos: JornadaInput) => Promise<Jornada>;
  eliminarJornada: (id: number) => Promise<void>;
}

export const JornadasContext = createContext<JornadasContextType>({
  jornadas: [],
  loading: true,
  error: null,
  recargar: async () => {},
  crearJornada: async () => {
    throw new Error("No inicializado.");
  },
  editarJornada: async () => {
    throw new Error("No inicializado.");
  },
  eliminarJornada: async () => {},
});
