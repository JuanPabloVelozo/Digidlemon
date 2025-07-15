export default function DigimonCard({ digimon }) {
    return (
        <div style={{ border: "1px solid #ddd", padding: "10px", margin: "10px", width: 180 }}>
            <h3>{digimon["digimón"]}</h3>
            <img src={digimon.imagen} alt={digimon["digimón"]} width="150" />
            <p>ID: {digimon.id}</p>
        </div>
    );
}
