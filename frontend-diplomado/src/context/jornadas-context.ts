import { createContext } from "react";
import type { Jornada } from "../types";

export interface JornadasContextType {
  jornadas: Jornada[];
  agregarJornada: (jornada: Jornada) => void;
}

export const JornadasContext = createContext<JornadasContextType>({
  jornadas: [],
  agregarJornada: () => {},
});
