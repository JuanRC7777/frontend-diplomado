import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adopcion from "./pages/Adopcion";
import Vacunacion from "./pages/Vacunacion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AdopcionesProvider } from "./context/AdopcionesContext";
import { JornadasProvider } from "./context/JornadasContext";

export default function App() {
  return (
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
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </JornadasProvider>
    </AdopcionesProvider>
  );
}