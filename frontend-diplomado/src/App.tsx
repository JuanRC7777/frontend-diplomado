import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adopcion from "./pages/Adopcion";
import Vacunacion from "./pages/Vacunacion";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AdopcionesProvider } from "./context/AdopcionesContext";
import { JornadasProvider } from "./context/JornadasContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AdopcionesProvider>
        <JornadasProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-[#FAF7F0]">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/adopcion" element={<Adopcion />} />
                  <Route path="/vacunacion" element={<Vacunacion />} />
                  <Route path="/auth" element={<Auth />} />
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