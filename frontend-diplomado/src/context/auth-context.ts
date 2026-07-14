import { createContext } from "react";

export interface Usuario {
  nombre: string;
  email: string;
  telefono?: string;
  password: string;
}

export interface AuthContextType {
  user: Omit<Usuario, "password"> | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (datos: Usuario) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  register: () => false,
});
