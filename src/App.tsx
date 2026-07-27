import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import AdopcionListado from "./pages/adopcion/AdopcionListado";
import AdopcionCrear from "./pages/adopcion/AdopcionCrear";
import AdopcionDetalle from "./pages/adopcion/AdopcionDetalle";
import AdopcionEditar from "./pages/adopcion/AdopcionEditar";
import VacunacionListado from "./pages/vacunacion/VacunacionListado";
import VacunacionCrear from "./pages/vacunacion/VacunacionCrear";
import VacunacionDetalle from "./pages/vacunacion/VacunacionDetalle";
import VacunacionEditar from "./pages/vacunacion/VacunacionEditar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";
import RutaAdmin from "./components/RutaAdmin";
import Admin from "./pages/Admin";
import { AdopcionesProvider } from "./context/AdopcionesContext";
import { JornadasProvider } from "./context/JornadasContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AdopcionesProvider>
        <JornadasProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/acerca" element={<About />} />
                  <Route
                    path="/admin"
                    element={
                      <RutaAdmin>
                        <Admin />
                      </RutaAdmin>
                    }
                  />

                  <Route path="/adopcion" element={<AdopcionListado />} />
                  <Route path="/adopcion/:id" element={<AdopcionDetalle />} />
                  <Route
                    path="/adopcion/crear"
                    element={
                      <RutaProtegida>
                        <AdopcionCrear />
                      </RutaProtegida>
                    }
                  />
                  <Route
                    path="/adopcion/:id/editar"
                    element={
                      <RutaProtegida>
                        <AdopcionEditar />
                      </RutaProtegida>
                    }
                  />

                  <Route path="/vacunacion" element={<VacunacionListado />} />
                  <Route path="/vacunacion/:id" element={<VacunacionDetalle />} />
                  <Route
                    path="/vacunacion/crear"
                    element={
                      <RutaProtegida>
                        <VacunacionCrear />
                      </RutaProtegida>
                    }
                  />
                  <Route
                    path="/vacunacion/:id/editar"
                    element={
                      <RutaProtegida>
                        <VacunacionEditar />
                      </RutaProtegida>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </JornadasProvider>
      </AdopcionesProvider>
    </AuthProvider>
  );
}
