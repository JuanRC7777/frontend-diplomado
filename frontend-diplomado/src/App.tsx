import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adopcion from "./pages/Adopcion";
import { AdopcionesProvider } from "./context/AdopcionesContext";

export default function App() {
  return (
    <AdopcionesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adopcion" element={<Adopcion />} />
        </Routes>
      </BrowserRouter>
    </AdopcionesProvider>
  );
}