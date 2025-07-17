import "../styles/ResultadoCard.css";

export default function ResultadoCard({ digimon, comparacion }) {
    function icono(ok) {
        return ok ? "✔️" : "❌";
    }

    function iconoField(fieldsComp) {
        if (fieldsComp.match) return "✔️";
        if (fieldsComp.partialMatch) return "🟨";
        return "❌";
    }

    function iconoReleaseDate(releaseDateComp) {
        if (releaseDateComp.match) return "✔️";
        if (releaseDateComp.direction === "up") return "⬇️";
        if (releaseDateComp.direction === "down") return "⬆️";
        return "❓";
    }

    return (
        <div className="resultado-card">
            <div className="resultado-card-item">
                <img src={digimon.image} alt={digimon.name} />
            </div>

            <div className="resultado-card-item">
                <span>{digimon.name}</span>
            </div>

            <div className="resultado-card-item">
                <span className="resultado-icon">{icono(comparacion.level.match)}</span>
                <span>{digimon.level}</span>
            </div>

            <div className="resultado-card-item">
                <span className="resultado-icon">{icono(comparacion.attribute.match)}</span>
                <span>{digimon.attribute}</span>
            </div>

            <div className="resultado-card-item">
                <span className="resultado-icon">{icono(comparacion.type.match)}</span>
                <span>{digimon.type}</span>
            </div>

            <div className="resultado-card-item">
                <span className="resultado-icon">{iconoField(comparacion.fields)}</span>
                <span>{digimon.fields.map(f => f.field).join(", ") || "Ninguno"}</span>
            </div>

            <div className="resultado-card-item">
                <span className="resultado-icon">{icono(comparacion.xAntibody.match)}</span>
                <span>{digimon.xAntibody ? "Sí" : "No"}</span>
            </div>

            <div className="resultado-card-item">
                <span className="resultado-icon">{iconoReleaseDate(comparacion.releaseDate)}</span>
                <span>{digimon.releaseDate}</span>
            </div>
        </div>
    );
}
