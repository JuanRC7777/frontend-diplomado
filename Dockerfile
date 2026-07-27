# ---- Stage 1: build de la app (compila TS y genera los estáticos) ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_API_URL se "hornea" dentro del bundle en tiempo de build,
# por eso se pasa como build arg y no como variable de entorno en runtime.
ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Stage 2: imagen final, solo nginx sirviendo los estáticos ----
FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/health >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
