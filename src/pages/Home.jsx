import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DigimonList from "../components/DigimonList";
import "../styles/home.css";

export default function Home() {
    const [showList, setShowList] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Select Game Mode</h1>
            <br />
            <div className="button-group">
                <button onClick={() => navigate("/adivina-nombre")}>
                    <span className="button-icon">🎯</span> Guess the Name
                </button>
                <button onClick={() => navigate("/de-quien-es-la-descripcion")}>
                    <span className="button-icon">📝</span> Whose Description Is It?
                </button>
                <button onClick={() => navigate("/de-quien-es-el-ataque")}>
                    <span className="button-icon">⚔️</span> Whose Attack Is It?
                </button>
                <button onClick={() => navigate("/de-quien-silueta")}>
                    <span className="button-icon">📷</span> Whose Silhouette Is It?
                </button>
            </div>

            <button
                className="toggle-list-button"
                onClick={() => setShowList(!showList)}
            >
                {showList ? "Hide Digimon List" : "Show Digimon List"}
            </button>

            {showList && <DigimonList />}
            </div>
    );
}

