const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

// arma de la url completa de una foto
export function resolverFoto(fotoUrl?: string | null): string | null {
  if (!fotoUrl) return null;
  if (fotoUrl.startsWith("http")) return fotoUrl;
  return `${SERVER_URL}${fotoUrl}`;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  accessToken?: string | null;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const esFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(esFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    credentials: "include",
    body: esFormData ? (options.body as FormData) : options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 204) return null as T;

  let data: { error?: string } | null;
  try {
    data = await res.json();
  } catch {
    // La respuesta no es JSON (ej. el proxy/host devolvio el index.html de la
    // SPA en vez de la API). Antes esto se tragaba como `data = null` y el
    // caller terminaba guardando null donde esperaba un array/objeto,
    // reventando mas adelante con errores confusos tipo "cannot read
    // properties of null". Mejor fallar aqui con un mensaje claro: casi
    // siempre es VITE_API_URL apuntando a la URL equivocada.
    throw new ApiError(
      res.status,
      res.ok
        ? "El servidor respondio algo que no es JSON. Revisa que VITE_API_URL apunte a la URL correcta de la API (con /api al final)."
        : "Error de red inesperado."
    );
  }

  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? "Error de red inesperado.");
  }
  return data as T;
}
