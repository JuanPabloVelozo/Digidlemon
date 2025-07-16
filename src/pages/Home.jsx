import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DigimonList from "../components/DigimonList";

export default function Home() {
    const [showList, setShowList] = useState(false);
    const navigate = useNavigate();

    return (
        <div>
            <h1>Digimondle - Selecciona un Juego</h1>
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => navigate("/adivina-nombre")}>
                    Adivina el nombre
                </button>
                <button
                    onClick={() => navigate("/de-quien-es-el-ataque")}
                    style={{ marginLeft: "10px" }}
                >
                    De quién es el ataque
                </button>
            </div>

            <button onClick={() => setShowList(!showList)}>
                {showList ? "Ocultar Lista de Digimon" : "Mostrar Lista de Digimon"}
            </button>

            {showList && <DigimonList />}
        </div>
    );
}


