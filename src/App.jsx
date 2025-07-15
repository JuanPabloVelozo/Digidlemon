import DigimonList from "./components/DigimonList";

export default function App() {
    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px" }}>
            <h1>Digimondle - Lista de Digimon</h1>
            <DigimonList />
        </div>
    );
}
