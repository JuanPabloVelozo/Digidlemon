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

    useEffect(() => {
        if (localStorage.getItem("digimonList") !== null) {
            try {
                let digi = JSON.parse(localStorage.getItem("digimonList"));
                setDigimonsDisponibles(digi);
                const objetivo = seleccionarDigimonObjetivo(digi, fecha, "jpputo");
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
                    const objetivo = seleccionarDigimonObjetivo(list, fecha, "jpputo");
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
        if (gameOver) return; // block input if game is over
        const val = e.target.value;
        setGuess(val);
        if (val.length < 1) {
            setSuggestions([]);
            return;
        }
        setSuggestions(filtrarSugerencias(digimonsDisponibles, val, 10));
    }

    function handleSuggestionClick(name) {
        if (gameOver) return; // block clicks if game is over

        const selected = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === name.toLowerCase()
        );
        if (selected) {
            processGuess(selected);
        }

        setGuess("");
        setSuggestions([]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (gameOver) return; // block submit if game is over
        if (!guess.trim()) return;

        const found = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === guess.trim().toLowerCase()
        );

        if (!found) {
            setResults((prev) => [
                ...prev,
                { guess: guess.trim(), error: "Not found" },
            ]);
            setGuess("");
            setSuggestions([]);
            return;
        }

        processGuess(found);
    }

    function processGuess(found) {
        const comparison = comparacionBasica(found, digimonObjetivo);
        setResults((prev) => [...prev, { digimon: found, comparacion: comparison }]);

        if (comparison.name.match) {
            launchConfetti();
            setGameOver(true);
        }

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");
        setSuggestions([]);
    }

    if (loading) return <p>Loading data...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!digimonObjetivo) return <p>Target Digimon not found.</p>;
    if (!digimonObjetivo.description || digimonObjetivo.description === "Desconocido")
        return <p>The target Digimon has no valid description.</p>;

    return (
        <div className="container" style={{ position: "relative" }}>
            <h2>Whose description is this?</h2>

            <div className="description-box">
                <p>{digimonObjetivo.description}</p>
            </div>

            {!gameOver && (
                <form onSubmit={handleSubmit} className="form-container">
                    <input
                        type="text"
                        value={guess}
                        onChange={handleInputChange}
                        placeholder="Type a name"
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

            {/* Confetti container */}
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
