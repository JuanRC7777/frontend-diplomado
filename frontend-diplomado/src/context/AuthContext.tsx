import { createContext, useCallback, useState, type ReactNode } from "react";

interface Usuario {
  nombre: string;
  email: string;
  telefono?: string;
  password: string;
}

interface AuthContextType {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<Usuario, "password"> | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { nombre: "Usuario Demo", email: "demo@diplomado.co", telefono: "300 000 0000", password: "demo123" },
  ]);

  const login = useCallback(
    (email: string, password: string): boolean => {
      const encontrado = usuarios.find((u) => u.email === email && u.password === password);
      if (!encontrado) return false;
      setUser({ nombre: encontrado.nombre, email: encontrado.email, telefono: encontrado.telefono });
      return true;
    },
    [usuarios]
  );

  const logout = useCallback(() => setUser(null), []);

  const register = useCallback(
    (datos: Usuario): boolean => {
      const existe = usuarios.some((u) => u.email === datos.email);
      if (existe) return false;
      setUsuarios((prev) => [...prev, datos]);
      setUser({ nombre: datos.nombre, email: datos.email, telefono: datos.telefono });
      return true;
    },
    [usuarios]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
