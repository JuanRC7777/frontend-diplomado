export interface Animal {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  unidadEdad: string;
  tamano: string;
  sexo: string;
  estadoSalud: string;
  vacunado: boolean;
  esterilizado: boolean;
  descripcion: string;
  foto: string;
  ciudad: string;
  contacto: string;
  telefono: string;
  fecha_publicacion: string;
  carnet?: string;
  publicadoPor?: string;
}
export interface Jornada {
  id: number;
  titulo: string;
  lugar: string;
  ciudad: string;
  fecha: string;
  hora: string;
  horaFin: string;
  vacunas: string[];
  organizador: string;
  contacto: string;
  cupos: number;
  descripcion: string;
  fecha_publicacion: string;
}