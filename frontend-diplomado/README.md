# PawCare - Frontend

Este es el frontend del proyecto PawCare (adopción de mascotas y jornadas de vacunación), hecho con React + TypeScript +Vite

## Primeramente

Este proyecto **solo es la parte visual**. Para que funcione de verdad (poder registrarte, ver los animales, crear publicaciones, etc.) necesitas tener corriendo también el backend, que está en otro repositorio aparte: `backend-diplomado`. Sin el backend prendido, la página carga pero no vas a poder hacer login ni ver datos reales.

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Y revisa que tenga esto (por defecto ya debería estar bien si el backend corre en el puerto 4000, que es lo normal):

```
VITE_API_URL=http://localhost:4000/api
```

Esa variable es la URL a la que el frontend le hace todas las peticiones (login, listar animales, crear jornadas, subir fotos, etc). Si cambias el puerto del backend, tienes que cambiar esto también.

## Correrlo

```bash
npm run dev
```

Se abre normalmente en `http://localhost:5173`.

## Ojo con esto (para que no te salgan errores raros)

- El backend tiene que estar corriendo ANTES de usar el frontend (si no, te va a salir error de red al intentar iniciar sesión o cargar el listado).
- El backend tiene una variable llamada `CORS_ORIGIN` en su `.env`, que por defecto es `http://localhost:5173`. Si corres el frontend en otro puerto o dominio distinto, el backend va a bloquear las peticiones (error de CORS en la consola del navegador) hasta que ajustes esa variable allá.
- Las fotos que subes (al crear un animal) se guardan en el backend, no aquí — por eso también necesitas el backend andando para que las imágenes se vean.

## Estructura (por si te pierdes)

```
src/
  pages/        -> las pantallas (Home, Auth, Adopcion, Vacunacion, etc)
  components/   -> cosas reutilizables (Navbar, Card, Button, formularios...)
  context/      -> el estado global (sesión del usuario, listado de animales/jornadas)
  lib/          -> las funciones que hablan con la API del backend
  types.ts      -> los tipos de TypeScript (Animal, Jornada, Vacuna)
```

## Páginas que tiene

- `/` - inicio
- `/auth` - login y registro
- `/acerca` - acerca de
- `/adopcion` - listado de animales, y `/adopcion/:id` para ver el detalle
- `/adopcion/crear` y `/adopcion/:id/editar` - publicar/editar (necesita estar logueado)
- `/vacunacion` - igual pero para jornadas de vacunación
