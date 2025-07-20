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
import ResultadoSimple from "../components/ResultadoSimple";

export default function DescriptionGame() {
    const navigate = useNavigate();

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
    const [inputError, setInputError] = useState("");

    const failedAttempts = results.filter((r) => !(r.comparacion?.name?.match)).length;

    useEffect(() => {
        if (localStorage.getItem("digimonList") !== null) {
            try {
                let digi = JSON.parse(localStorage.getItem("digimonList"));
                setDigimonsDisponibles(digi);
                const objetivo = seleccionarDigimonObjetivo(digi, fecha, "objCode$135/dgm");
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
                    const objetivo = seleccionarDigimonObjetivo(list, fecha, "objCode$135/dgm");
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

    function handleInputChange(e) {
        if (gameOver) return;
        setInputError("");
        const val = e.target.value;
        setGuess(val);

        if (val.length < 1) {
            setSuggestions([]);
            return;
        }

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
        setInputError("");
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (gameOver) return;

        if (!guess.trim()) {
            setInputError("Por favor, escribe un nombre");
            return;
        }

        const found = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === guess.trim().toLowerCase()
        );

        if (!found) {
            setInputError("Digimon no encontrado");
            return;
        }

        setInputError("");
        procesarAdivinanza(found);
    }

    if (loading) return <p className="status-message">Loading data...</p>;
    if (error) return <p className="status-message status-error">Error: {error}</p>;
    if (!digimonObjetivo)
        return (
            <p className="status-message status-error">
                Target Digimon not found.
            </p>
        );
    if (!digimonObjetivo.description || digimonObjetivo.description === "Desconocido")
        return <p>The target Digimon has no valid description.</p>;

    return (
        <div className="container" style={{ position: "relative" }}>
            <h2>Whose description is this?</h2>

            <div className="description-box">
                <p>{digimonObjetivo.description}</p>
            </div>

            {/* Contenedor de pistas */}
            <div className="hints-container">
                <div className="hint-box">
                    <strong>Clue - Year appeared:</strong>
                    <span>{failedAttempts >= 5 ? digimonObjetivo.releaseDate || "Desconocido" : ""}</span>
                </div>

                <div className="hint-box">
                    <strong>Clue - main attack:</strong>
                    <span>{failedAttempts >= 10 ? digimonObjetivo.skill || "Desconocido" : ""}</span>
                </div>
            </div>


            {!gameOver && (
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={guess}
                            onChange={handleInputChange}
                            placeholder="Type a name"
                            autoComplete="off"
                            className="input-guess"
                            disabled={gameOver}
                        />

                        {(suggestions.length > 0 || inputError) && (
                            <ul className="suggestions-list">
                                {inputError ? (
                                    <li className="error-item" onMouseDown={(e) => e.preventDefault()}>
                                        {inputError}
                                    </li>
                                ) : (
                                    suggestions.map((sug) => (
                                        <li
                                            key={sug.id}
                                            onClick={() => handleSuggestionClick(sug.name)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            <img src={sug.image} alt={sug.name} width={40} height={40} />
                                            <span>{sug.name}</span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>

                    <button type="submit" className="submit-button" disabled={gameOver}>
                        Try
                    </button>
                </form>
            )}

            {gameOver && (
                <div className="success-message">
                    <h3>Correct!</h3>
                    <div className="success-button-container">
                        <button
                            onClick={() => navigate("/de-quien-es-el-ataque")}
                            className="success-button"
                        >
                            <span className="button-icon">⚔️</span>
                        </button>
                    </div>
                </div>
            )}

            <h3>Attempts:</h3>
            <div className="attempts-container">
                <ul className="attempts-list">
                    {[...results].reverse().map((r, index) => (
                        <li key={index}>
                            {r.error ? (
                                <div>
                                    <strong>{r.guess}</strong>: {r.error}
                                </div>
                            ) : (
                                <ResultadoSimple digimon={r.digimon} status={r.comparacion} />
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

