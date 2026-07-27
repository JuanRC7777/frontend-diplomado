import { apiFetch } from "./api";
import type { SolicitudAdopcion } from "../types";

export interface SolicitudInput {
  animal_id: number;
  nombre_solicitante: string;
  telefono_solicitante: string;
  email_solicitante: string;
  mensaje?: string;
}

// cualquier visitante puede solicitar informacion de un animal, sin sesion
export function crearSolicitud(datos: SolicitudInput) {
  return apiFetch<SolicitudAdopcion>("/solicitudes", { method: "POST", body: datos });
}

// solo admin
export function listarSolicitudes(accessToken: string | null) {
  return apiFetch<SolicitudAdopcion[]>("/solicitudes", { accessToken });
}
