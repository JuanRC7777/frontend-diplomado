# PawCare - Frontend

Este es el frontend del proyecto PawCare (adopción de mascotas y jornadas de vacunación), hecho con React + TypeScript +Vite

## Primeramente

Este proyecto **solo es la parte visual**. Para que funcione de verdad (poder registrarte, ver los animales, crear publicaciones, etc.) necesitas tener corriendo también el backend, que está en otro repositorio aparte: `backend-diplomado`. Sin el backend prendido, la página carga pero no vas a poder hacer login ni ver datos reales.

## Requisitos

- Node.js LTS (v20 o superior)
- npm (incluido con Node.js)
- Git

Editor recomendado: Visual Studio Code, con las extensiones ESLint, Prettier y ES7+ React/Redux/React-Native snippets.

Verificar instalación:

```bash
node -v
npm -v
```

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

Si no creas el `.env`, el frontend igual funciona: usa `http://localhost:4000/api` por defecto (definido en `src/lib/api.ts`). Solo necesitas el `.env` si tu backend corre en otro puerto, otro host, o en producción.

La URL para ver las fotos subidas (`SERVER_URL`) se calcula sola a partir de `VITE_API_URL` (le quita el `/api` del final) — no hay que configurarla aparte.

## Correrlo

```bash
npm run dev
```

Se abre normalmente en `http://localhost:5173`.

## Ojo con esto (para que no te salgan errores raros)

- El backend tiene que estar corriendo ANTES de usar el frontend (si no, te va a salir error de red al intentar iniciar sesión o cargar el listado).
- El backend tiene una variable llamada `CORS_ORIGIN` en su `.env`, que por defecto es `http://localhost:5173`. Si corres el frontend en otro puerto o dominio distinto, el backend va a bloquear las peticiones (error de CORS en la consola del navegador) hasta que ajustes esa variable allá.
- El frontend manda las peticiones con `credentials: "include"` (para que viajen las cookies de sesión). Esto significa que en el backend `CORS_ORIGIN` **no puede ser `*`**, tiene que ser el origen exacto del frontend (ej. `http://localhost:5173`) y con las credenciales habilitadas — si no, el login parece fallar sin motivo aparente aunque el backend esté prendido.
- Las fotos que subes (al crear un animal) se guardan en el backend, no aquí — por eso también necesitas el backend andando para que las imágenes se vean.
- Si ves errores de CORS o "Failed to fetch" en la consola del navegador, revisa primero: (1) que el backend esté corriendo, (2) que `VITE_API_URL` apunte al puerto correcto, (3) que `CORS_ORIGIN` del backend coincida exactamente con la URL desde la que abres el frontend.

## Docker

También se puede construir y correr con Docker en vez de `npm run dev` (útil para probar el build de producción o desplegarlo).

Como `VITE_API_URL` se incrusta en el bundle al momento de compilar (no es una variable que se lea en runtime), hay que pasarla como *build arg* apuntando a donde esté corriendo el backend:

```bash
docker build -t pawcare-frontend --build-arg VITE_API_URL=http://localhost:4000/api .
docker run -p 8080:80 pawcare-frontend
```

Se abre en `http://localhost:8080`. Internamente el Dockerfile hace dos etapas: compila con Node y sirve los archivos estáticos resultantes con nginx (configurado en `nginx.conf` para que las rutas de React Router, como `/adopcion/123`, funcionen bien al recargar la página).

Si cambias a qué backend apunta, hay que **reconstruir la imagen** (no basta con reiniciar el contenedor), porque esa URL ya quedó fija dentro del build.

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
