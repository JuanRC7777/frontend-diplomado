import { createContext, useState, type ReactNode } from "react";
import type { Jornada } from "../types";
import jornadasIniciales from "../data/jornadas.json";

interface JornadasContextType {
  jornadas: Jornada[];
  agregarJornada: (jornada: Jornada) => void;
}

export const JornadasContext = createContext<JornadasContextType>({
  jornadas: [],
  agregarJornada: () => {},
});

export function JornadasProvider({ children }: { children: ReactNode }) {
  const [jornadas, setJornadas] = useState<Jornada[]>(jornadasIniciales);

  function agregarJornada(jornada: Jornada) {
    setJornadas((prev) => [jornada, ...prev]);
  }

  return (
    <JornadasContext.Provider value={{ jornadas, agregarJornada }}>
      {children}
    </JornadasContext.Provider>
  );
}