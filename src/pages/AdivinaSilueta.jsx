import { useEffect, useState } from "react";
import { fetchDigimonList } from "../services/digimonAPI";
import {
    seleccionarDigimonObjetivo,
    filtrarSugerencias,
    comparacionBasica
} from "../utils/digimonUtils";
import "../styles/AdivinaNombre.css";

export default function AdivinaSilueta() {
    const [digimonsDisponibles, setDigimonsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [guess, setGuess] = useState("");
    const [results, setResults] = useState([]);
    const [digimonObjetivo, setDigimonObjetivo] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [fecha] = useState(new Date());
    const [nivelRevelado, setNivelRevelado] = useState(0); // 0-5 niveles

    useEffect(() => {
        fetchDigimonList(0, 1488)
            .then((list) => {
                setDigimonsDisponibles(list);
                const objetivo = seleccionarDigimonObjetivo(list, fecha, "manqueque");
                setDigimonObjetivo(objetivo);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [fecha]);

    function handleInputChange(e) {
        const val = e.target.value;
        setGuess(val);
        setSuggestions(filtrarSugerencias(digimonsDisponibles, val, 10));
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
            aumentarRevelado();
            return;
        }

        procesarAdivinanza(found);
    }

    function aumentarRevelado() {
        setNivelRevelado((prev) => Math.min(5, prev + 1));
    }

    function procesarAdivinanza(found) {
        const comparacion = comparacionBasica(found, digimonObjetivo);
        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        if (comparacion.name.match) {
            setNivelRevelado(5); // Revelado completo si acierta
        } else {
            aumentarRevelado();
        }

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");
        setSuggestions([]);
    }

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!digimonObjetivo) return <p>No se encontró al Digimon objetivo.</p>;

    // Definimos el tamaño del contenedor fijo
    const containerSize = 250;
    // Cada nivel revela más área visible (menos zoom y desplazamiento más pequeño)
    // Nivel 0: Muy zoom + desplazamiento lejos del centro
    // Nivel 5: imagen completa
    // Ajustamos escala y translate para simular "revelar"

    const maxNivel = 5;
    const scale = 3 - (nivelRevelado * 0.4); // escala va de 3x a 1x
    const maxTranslate = 80; // px máximo que se mueve la imagen desde centro
    // Se mueve menos cuanto más revelado
    const translateX = (maxNivel - nivelRevelado) * (maxTranslate / maxNivel);
    const translateY = (maxNivel - nivelRevelado) * (maxTranslate / maxNivel);

    return (
        <div className="container">
            <h2>¿Quién es este Digimon?</h2>

            <div
                className="silueta-box"
                style={{
                    width: containerSize,
                    height: containerSize,
                    overflow: "hidden",
                    margin: "0 auto",
                    borderRadius: 12,
                    border: "2px solid #333",
                    position: "relative",
                    backgroundColor: "#ddd",
                }}
            >
                <img
                    src={digimonObjetivo.image}
                    alt="Silueta del Digimon"
                    style={{
                        width: containerSize,
                        height: containerSize,
                        objectFit: "cover",
                        transformOrigin: "center",
                        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                        transition: "transform 0.5s ease",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                    draggable={false}
                />
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
                            <div>
                                <strong>{r.guess}</strong>: {r.error}
                            </div>
                        ) : (
                            <div className="simple-result">
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
