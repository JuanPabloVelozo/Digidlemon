import "../styles/ResultadoCard.css";

export default function ResultadoCard({ digimon, comparacion }) {
    function icono(ok) {
        return ok ? "status-correct" : "status-wrong";
    }

    function iconoField(fieldsComp) {
        if (fieldsComp.match) return "status-correct";       // verde
        if (fieldsComp.partialMatch) return "status-partial"; // amarillo
        return "status-wrong";                                // rojo
    }

    function iconoReleaseDate(releaseDateComp) {
        if (releaseDateComp.match) return "status-correct";
        if (releaseDateComp.direction === "up") return "status-wrong arrow-down";
        if (releaseDateComp.direction === "down") return "status-wrong arrow-up";
        return "status-wrong";
    }

    const nivelesOrden = [
        "Baby I",
        "Baby II",
        "Child",
        "Adult",
        "Perfect",
        "Ultimate"
    ];

    return (
            <div className="resultado-card">
            <div className={`resultado-card-item ${icono(comparacion.name?.match)}`}>
                <img src={digimon.image} alt={digimon.name} />
            </div>

            <div className={`resultado-card-item ${icono(comparacion.name?.match)}`}>
                <span>{digimon.name.replace(/([^\s])\(/g, "$1 (")}</span>
            </div>

            <div className={`resultado-card-item ${iconoReleaseDate(comparacion.level)}`}
                data-arrow={
                    comparacion.level.direction === "up" ? "↓" :
                        comparacion.level.direction === "down" ? "↑" :
                            ""
                }>
                <span>{digimon.level}</span>
            </div>

                <div className={`resultado-card-item ${icono(comparacion.attribute.match)}`}>
                    <span>{digimon.attribute}</span>
                </div>

                <div className={`resultado-card-item ${icono(comparacion.type.match)}`}>
                    <span>{digimon.type}</span>
            </div>
            <div className={`resultado-card-item ${iconoField(comparacion.fields)}`}>
                <span className="resultado-icon"> </span>
                <span>{digimon.fields.map(f => f.field).join(", ") || "Ninguno"}</span>
            </div>

            <div className={`resultado-card-item ${icono(comparacion.xAntibody.match)}`}>
                <span className="resultado-icon"> </span>
                <span>{digimon.xAntibody ? "Sí" : "No"}</span>
            </div>

            <div className={`resultado-card-item ${iconoReleaseDate(comparacion.releaseDate)}`} data-arrow={comparacion.releaseDate.direction === "up" ? "↓" : comparacion.releaseDate.direction === "down" ? "↑" : ""}>
                <span>{digimon.releaseDate}</span>
            </div>

            </div>
        );
}
