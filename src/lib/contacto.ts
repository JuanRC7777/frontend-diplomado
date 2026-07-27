// Arma el mailto: para pedir informacion de adopcion de un animal, con
// asunto y cuerpo prellenados (en vez de un mailto en blanco).
export function mailtoSolicitarAdopcion(animal: { id: number; nombre: string; contacto_email: string }) {
  const asunto = `Solicitud de información - adopción de ${animal.nombre}`;
  const cuerpo =
    `Hola,\n\n` +
    `Vi la publicación de ${animal.nombre} (ID: ${animal.id}) en PawCare y me gustaría más información para adoptarlo.\n\n` +
    `Quedo atento/a a tu respuesta.`;

  return `mailto:${animal.contacto_email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}
