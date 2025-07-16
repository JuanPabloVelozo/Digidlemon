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
        return "❓"; // Por si direction es indefinida o diferente
    }

    return (
        <div style={{ border: "2px solid #aaa", padding: "10px", margin: "10px", width: 260 }}>
            <h3>{digimon.name}</h3>
            <img
                src={digimon.image}
                alt={digimon.name}
                width="150"
                style={{ objectFit: "contain" }}
            />
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                <li>{icono(comparacion.xAntibody.match)} X-Antibody: {digimon.xAntibody ? "Sí" : "No"}</li>
                <li>{icono(comparacion.level.match)} Nivel: {digimon.level}</li>
                <li>{icono(comparacion.attribute.match)} Atributo: {digimon.attribute}</li>
                <li>{icono(comparacion.type.match)} Tipo: {digimon.type}</li>
                <li>{iconoField(comparacion.fields)} Fields: {digimon.fields.map(f => f.field).join(", ") || "Ninguno"}</li>
                <li>{iconoReleaseDate(comparacion.releaseDate)} Release Date: {digimon.releaseDate}</li>
            </ul>
        </div>
    );
}
