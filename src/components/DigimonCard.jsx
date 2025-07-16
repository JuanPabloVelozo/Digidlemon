export default function DigimonCard({ digimon }) {
    return (
        <div style={{ border: "1px solid #ddd", padding: "10px", margin: "10px", width: 240 }}>
            <h3>{digimon.name}</h3>
            <img
                src={digimon.image}
                alt={digimon.name}
                width="150"
                style={{ objectFit: "contain" }}
            />
            <p>ID: {digimon.id}</p>
            <p>X-Antibody: {digimon.xAntibody ? "Sí" : "No"}</p>
            <p>Nivel: {digimon.level}</p>
            <p>Atributo: {digimon.attribute}</p>
            <p>Tipo: {digimon.type}</p>
            <p>Ataque: {digimon.skill}</p>
            <p>{digimon.skillDescrip}</p>
            <p>Descripcion Digimon:</p><p>{digimon.description}</p>
            <div>
                <h4>Fields:</h4>
                {digimon.fields && digimon.fields.length > 0 ? (
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                        {digimon.fields.map((field) => (
                            <li key={field.id} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                                <img
                                    src={field.image}
                                    alt={field.field}
                                    width="24"
                                    height="24"
                                    style={{ marginRight: "8px", objectFit: "contain" }}
                                />
                                <span>{field.field}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay fields disponibles.</p>
                )}

            </div>
            <p>Fecha: {digimon.releaseDate}</p>
        </div>
    );
}
