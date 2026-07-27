// tipo de animal
export interface Animal {
  id: number;
  usuario_id: number | null;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  unidad_edad: "meses" | "años";
  tamano: "Pequeño" | "Mediano" | "Grande";
  sexo: "Macho" | "Hembra";
  estado_salud: string;
  vacunado: boolean;
  esterilizado: boolean;
  descripcion: string | null;
  foto_url: string | null;
  ciudad: string;
  contacto_email: string;
  contacto_telefono: string;
  carnet?: string | null;
  fecha_publicacion: string;
}

export interface Vacuna {
  id: number;
  nombre: string;
}

export interface SolicitudAdopcion {
  id: number;
  animal_id: number;
  nombre_solicitante: string;
  telefono_solicitante: string;
  email_solicitante: string;
  mensaje: string | null;
  fecha_solicitud: string;
  Animal?: { id: number; nombre: string; foto_url: string | null };
}

export interface Jornada {
  id: number;
  usuario_id: number | null;
  titulo: string;
  lugar: string;
  ciudad: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  organizador: string;
  contacto_email: string;
  cupos: number;
  descripcion: string | null;
  fecha_publicacion: string;
  Vacunas: Vacuna[]; // las vacunas que incluye
}
