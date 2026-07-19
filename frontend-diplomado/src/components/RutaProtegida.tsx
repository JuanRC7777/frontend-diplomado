import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import Loader from "./Loader";

// si no hay sesion manda para el login
export default function RutaProtegida({ children }: { children: ReactNode }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader label="Verificando sesión..." />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
