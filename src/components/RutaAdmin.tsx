import { useContext } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../context/auth-context";
import Loader from "./Loader";
import Alert from "./Alert";

// solo deja pasar si el usuario logueado tiene rol admin
export default function RutaAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader label="Verificando sesión..." />;
  if (user?.rol !== "admin") {
    return (
      <div className="p-10">
        <Alert variant="error">Esta página es solo para administradores.</Alert>
      </div>
    );
  }
  return <>{children}</>;
}
