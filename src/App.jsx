import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import AdivinaNombre from "./pages/AdivinaNombre";
import DescripcionGame from "./pages/DescripcionGame";  // Importar el juego nuevo
import "./App.css";

export default function App() {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <div className="logo-container" onClick={() => navigate("/")}>
                <img src="/images/logo.png" alt="Logo" className="home-logo" />
            </div>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/adivina-nombre" element={<AdivinaNombre />} />
                <Route path="/de-quien-es-la-descripcion" element={<DescripcionGame />} />
            </Routes>
        </div>
    );
}

