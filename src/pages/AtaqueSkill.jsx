import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDigimonList } from "../services/digimonAPI";
import {
    seleccionarDigimonObjetivo,
    filtrarSugerencias,
    comparacionBasica,
    generarConfeti,
    colors,
} from "../utils/digimonUtils";
import "../styles/main.css";
import ResultadoSimple from "./ResultadoSimple";

export default function DescripcionGame() {
    const [digimonsDisponibles, setDigimonsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [guess, setGuess] = useState("");
    const [results, setResults] = useState([]);
    const [digimonObjetivo, setDigimonObjetivo] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [fecha] = useState(new Date());

    const [confettiPieces, setConfettiPieces] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("digimonList") !== null) {
            try {
                const digi = JSON.parse(localStorage.getItem("digimonList"));
                setDigimonsDisponibles(digi);
                const objetivo = seleccionarDigimonObjetivo(digi, fecha, "furryhumi");
                setDigimonObjetivo(objetivo);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        } else {
            fetchDigimonList(0, 1488)
                .then((list) => {
                    setDigimonsDisponibles(list);
                    const objetivo = seleccionarDigimonObjetivo(list, fecha, "furryhumi");
                    setDigimonObjetivo(objetivo);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [fecha]);

    function launchConfetti() {
        const pieces = generarConfeti(window.innerWidth, 60);
        setConfettiPieces(pieces);
        setTimeout(() => setConfettiPieces([]), 1500);
    }

    function handleInputChange(e) {
        if (gameOver) return;
        const val = e.target.value;
        setGuess(val);
        setSuggestions(filtrarSugerencias(digimonsDisponibles, val, 10));
    }

    function handleSuggestionClick(name) {
        if (gameOver) return;

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
        if (gameOver) return;

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
        const comparacion = comparacionBasica(found, digimonObjetivo);
        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        if (comparacion.name.match) {
            launchConfetti();
            setGameOver(true);
        }

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");
        setSuggestions([]);
    }

    function handleContinue() {
        // Cambia la ruta aquí según el flujo de tu app
        navigate("/gameover");
    }

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!digimonObjetivo) return <p>No se encontró al Digimon objetivo.</p>;
    if (!digimonObjetivo.description || digimonObjetivo.description === "Desconocido")
        return <p>El Digimon objetivo no tiene descripción válida.</p>;

    return (
        <div className="container" style={{ position: "relative" }}>
            <h2>¿De quién es el ataque?</h2>

            <div className="description-box">
                <h4>{digimonObjetivo.skill}</h4>
                <p>{digimonObjetivo.skillDescrip}</p>
            </div>

            {!gameOver && (
                <form onSubmit={handleSubmit} className="form-container">
                    <input
                        type="text"
                        value={guess}
                        onChange={handleInputChange}
                        placeholder="Escribe un nombre"
                        autoComplete="off"
                        className="input-guess"
                        disabled={gameOver}
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

                    <button type="submit" className="submit-button" disabled={gameOver}>
                        Probar
                    </button>
                </form>
            )}

            {gameOver && (
                <div className="success-message">
                    <h3>Correct!</h3>
                    <div className="success-button-container">
                        <button
                            onClick={() => navigate("/de-quien-silueta")}
                            className="success-button"
                        >
                            <span className="button-icon">📷</span> 
                        </button>
                    </div>
                </div>
            )}

            <h3>Intentos:</h3>
            <div className="attempts-container">
                <ul className="attempts-list">
                    {[...results].reverse().map((r, index) => (
                        <li key={index}>
                            {r.error ? (
                                <div>
                                    <strong>{r.guess}</strong>: {r.error}
                                </div>
                            ) : (
                                <ResultadoSimple
                                    digimon={r.digimon}
                                    status={r.comparacion}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="confetti-container">
                {confettiPieces.map(({ id, left, delay, colorIndex }) => (
                    <div
                        key={id}
                        className="confetti-piece"
                        style={{
                            left,
                            animationDelay: `${delay}s`,
                            backgroundColor: colors[colorIndex],
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
