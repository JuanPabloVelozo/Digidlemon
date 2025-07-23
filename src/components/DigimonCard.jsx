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
            <p>X-Antibody: {digimon.xAntibody ? "Yes" : "No"}</p>
            <p>Levl: {digimon.level}</p>
            <p>Attribute: {digimon.attribute}</p>
            <p>Type: {digimon.type}</p>
            <p>Main Attack: {digimon.skill}</p>
            <p>{digimon.skillDescrip}</p>
            <p>Description:</p><p>{digimon.description}</p>
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
                    <p>No fields available.</p>
                )}

            </div>
            <p>Date: {digimon.releaseDate}</p>
        </div>
    );
}
