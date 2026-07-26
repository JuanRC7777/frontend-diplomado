import { apiFetch } from "./api";
import type { Animal } from "../types";

export interface AnimalInput {
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  unidad_edad: "meses" | "años";
  tamano: "Pequeño" | "Mediano" | "Grande";
  sexo: "Macho" | "Hembra";
  vacunado: boolean;
  esterilizado: boolean;
  descripcion?: string;
  ciudad: string;
  contacto_email: string;
  contacto_telefono: string;
  carnet?: string;
}

interface ListParams {
  ciudad?: string;
  especie?: string;
  q?: string;
}
// query string para los filtros
function toQueryString(params: ListParams = {}) {
  const entradas = Object.entries(params).filter(([, v]) => v) as [string, string][];
  return entradas.length === 0 ? "" : `?${new URLSearchParams(entradas).toString()}`;
}

function toFormData(datos: AnimalInput, foto?: File | null) {
  const fd = new FormData();
  Object.entries(datos).forEach(([key, value]) => {
    if (value !== undefined && value !== null) fd.append(key, String(value));
  });
  if (foto) fd.append("foto", foto);
  return fd;
}

export function listAnimales(params?: ListParams) {
  return apiFetch<Animal[]>(`/animales${toQueryString(params)}`);
}

export function getAnimal(id: number | string) {
  return apiFetch<Animal>(`/animales/${id}`);
}

export function createAnimal(datos: AnimalInput, foto: File | null, accessToken: string | null) {
  return apiFetch<Animal>("/animales", { method: "POST", body: toFormData(datos, foto), accessToken });
}

export function updateAnimal(id: number | string, datos: AnimalInput, foto: File | null, accessToken: string | null) {
  return apiFetch<Animal>(`/animales/${id}`, { method: "PUT", body: toFormData(datos, foto), accessToken });
}

export function deleteAnimal(id: number | string, accessToken: string | null) {
  return apiFetch<null>(`/animales/${id}`, { method: "DELETE", accessToken });

}
