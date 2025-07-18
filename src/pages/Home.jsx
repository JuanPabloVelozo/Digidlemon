import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DigimonList from "../components/DigimonList";
import "../styles/home.css";

export default function Home() {
    const [showList, setShowList] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Digimondle</h1>
            <h1>select game mode</h1>
            <br />
            <div className="button-group">
                <button onClick={() => navigate("/adivina-nombre")}>
                    <span className="button-icon">🎯</span> Adivina el nombre
                </button>
                <button onClick={() => navigate("/de-quien-es-la-descripcion")}>
                    <span className="button-icon">📝</span> De quién es la descripción
                </button>
                <button onClick={() => navigate("/de-quien-es-el-ataque")}>
                    <span className="button-icon">⚔️</span> De quién es el ataque
                </button>
                <button onClick={() => navigate("/de-quien-silueta")}>
                    <span className="button-icon">📷</span> De quién es la foto
                </button>
            </div>

            <button
                className="toggle-list-button"
                onClick={() => setShowList(!showList)}
            >
                {showList ? "Ocultar Lista de Digimon" : "Mostrar Lista de Digimon"}
            </button>

            {showList && <DigimonList />}
        </div>
    );
}

