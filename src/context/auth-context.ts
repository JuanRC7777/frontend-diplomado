import { createContext } from "react";

// datos publicos del usuario
export interface PublicUser {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: "usuario" | "admin";
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export interface RegistroDatos {
  nombre: string;
  email: string;
  telefono?: string;
  password: string;
}

export interface AuthContextType {
  user: PublicUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (datos: RegistroDatos) => Promise<AuthResult>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  loading: true,
  login: async () => ({ ok: false, error: "No inicializado." }),
  logout: async () => {},
  register: async () => ({ ok: false, error: "No inicializado." }),
});
