import React from "react";
import "../styles/ResultadoSimple.css";

export default function ResultadoSimple({ digimon, status }) {
    function icono(ok) {
        return ok ? "status-correct" : "status-wrong";
    }

    return (
        <div className="resultado-simple-card">
            <div className={`resultado-simple-card-item ${icono(status.name?.match)}`}>
                <img src={digimon.image} alt={digimon.name} />
                <span>{digimon.name.replace(/([^\s])\(/g, "$1 (")}</span>
            </div>
        </div>
    );
}

