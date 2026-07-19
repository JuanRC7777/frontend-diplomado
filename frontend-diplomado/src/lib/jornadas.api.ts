import { apiFetch } from "./api";
import type { Jornada, Vacuna } from "../types";

export interface JornadaInput {
  titulo: string;
  lugar: string;
  ciudad: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  organizador: string;
  contacto_email: string;
  cupos: number;
  descripcion?: string;
  vacunas: number[];
}

interface ListParams {
  ciudad?: string;
  q?: string;
}

function toQueryString(params: ListParams = {}) {
  const entradas = Object.entries(params).filter(([, v]) => v) as [string, string][];
  return entradas.length === 0 ? "" : `?${new URLSearchParams(entradas).toString()}`;
}

export function listJornadas(params?: ListParams) {
  return apiFetch<Jornada[]>(`/jornadas${toQueryString(params)}`);
}

export function getJornada(id: number | string) {
  return apiFetch<Jornada>(`/jornadas/${id}`);
}

export function createJornada(datos: JornadaInput, accessToken: string | null) {
  return apiFetch<Jornada>("/jornadas", { method: "POST", body: datos, accessToken });
}

export function updateJornada(id: number | string, datos: JornadaInput, accessToken: string | null) {
  return apiFetch<Jornada>(`/jornadas/${id}`, { method: "PUT", body: datos, accessToken });
}

export function deleteJornada(id: number | string, accessToken: string | null) {
  return apiFetch<null>(`/jornadas/${id}`, { method: "DELETE", accessToken });
}

//trae el catalogo de las vacunas
export function listVacunas() {
  return apiFetch<Vacuna[]>("/vacunas");
}
