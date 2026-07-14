import { useState, type ReactNode } from "react";
import type { Jornada } from "../types";
import jornadasIniciales from "../data/jornadas.json";
import { JornadasContext } from "./jornadas-context";

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
