import { useEffect, useState } from "react";
import { fetchDigimonList } from "../services/digimonAPI";
import "../styles/AdivinaNombre.css";

export default function DescripcionGame() {
    const [digimonsDisponibles, setDigimonsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [guess, setGuess] = useState("");
    const [results, setResults] = useState([]);
    const [digimonObjetivo, setDigimonObjetivo] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetchDigimonList(0, 1488)
            .then((list) => {
                setDigimonsDisponibles(list);
                const objetivo = list.find((d) => d.name.toLowerCase() === "agumon");
                setDigimonObjetivo(objetivo);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    function handleInputChange(e) {
        const val = e.target.value;
        setGuess(val);

        if (val.length < 1) {
            setSuggestions([]);
            return;
        }

        const filtered = digimonsDisponibles
            .filter((d) => d.name.toLowerCase().startsWith(val.toLowerCase()))
            .slice(0, 10);

        setSuggestions(filtered);
    }

    function handleSuggestionClick(name) {
        const selected = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === name.toLowerCase()
        );

        if (selected) {
            procesarAdivinanza(selected);
        }

        setGuess("");
        setSuggestions([]);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (suggestions.length === 1) {
            procesarAdivinanza(suggestions[0]);
            return;
        }

        const found = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === guess.trim().toLowerCase()
        );

        if (!found) {
            setResults((prev) => [...prev, { guess: guess.trim(), error: "No encontrado" }]);
            setGuess("");
            setSuggestions([]);
            return;
        }

        procesarAdivinanza(found);
    }

    function procesarAdivinanza(found) {
        const comparacion = getComparacion(found, digimonObjetivo);
        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");
        setSuggestions([]);
    }

    function getComparacion(found, objetivo) {
        return {
            name: { match: found.name.toLowerCase() === objetivo.name.toLowerCase() },
        };
    }

    function icono(comparacion) {
        if (!comparacion) return "";
        if (comparacion.name.match) return "status-correct";
        return "status-wrong";
    }

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!digimonObjetivo) return <p>No se encontró al Digimon objetivo.</p>;
    if (!digimonObjetivo.description || digimonObjetivo.description === "Desconocido")
        return <p>El Digimon objetivo no tiene descripción válida.</p>;

    return (
        <div className="container">
            <h2>¿De quién es la descripción?</h2>

            <div className="description-box">
                <p>{digimonObjetivo.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="text"
                    value={guess}
                    onChange={handleInputChange}
                    placeholder="Escribe un nombre"
                    autoComplete="off"
                    className="input-guess"
                />

                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((sug) => (
                            <li
                                key={sug.id}
                                onClick={() => handleSuggestionClick(sug.name)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <img src={sug.image} alt={sug.name} width={40} height={40} />
                                <span>{sug.name}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <button type="submit" className="submit-button">
                    Probar
                </button>
            </form>

            <h3>Intentos:</h3>
            <ul className="attempts-list">
                {[...results].reverse().map((r, index) => (
                    <li key={index}>
                        {r.error ? (
                            <div><strong>{r.guess}</strong>: {r.error}</div>
                        ) : (
                            <div className={`simple-result ${icono(r.comparacion)}`}>
                                <img src={r.digimon.image} alt={r.digimon.name} width={60} height={60} />
                                <span>{r.digimon.name}</span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

