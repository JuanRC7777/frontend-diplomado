import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adopcion from "./pages/Adopcion";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adopcion" element={<Adopcion />} />
      </Routes>
    </BrowserRouter>
  );
}