import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDigimonList } from "../services/digimonAPI";
import ResultadoCard from "./ResultadoCard";
import "../styles/AdivinaNombre.css";
import {
    seleccionarDigimonObjetivo,
    filtrarSugerencias,
    comparacionCompleta,
    generarConfeti,
    colors,
} from "../utils/digimonUtils";

export default function AdivinaNombre() {
    const navigate = useNavigate();

    const [digimons, setDigimons] = useState([]);
    const [digimonsDisponibles, setDigimonsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guess, setGuess] = useState("");
    const [results, setResults] = useState([]);
    const [digimonObjetivo, setDigimonObjetivo] = useState(null);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [fecha] = useState(new Date());
    const [confettiPieces, setConfettiPieces] = useState([]);

    // New state to control if the game ended (correct guess)
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        async function loadDigimons() {
            try {
                let list =
                    localStorage.getItem("digimonList") !== null
                        ? JSON.parse(localStorage.getItem("digimonList"))
                        : await fetchDigimonList(0, 1488);

                setDigimons(list);
                setDigimonsDisponibles(list);
                setDigimonObjetivo(seleccionarDigimonObjetivo(list, fecha, "gordoputo"));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        loadDigimons();
    }, [fecha]);

    function launchConfetti() {
        const pieces = generarConfeti(window.innerWidth, 60);
        setConfettiPieces(pieces);
        setTimeout(() => setConfettiPieces([]), 1500);
    }

    function handleInputChange(e) {
        if (gameOver) return; // Do not allow changes if game ended

        const val = e.target.value;
        setGuess(val);
        if (val.length < 1) {
            setSuggestions([]);
            return;
        }
        setSuggestions(filtrarSugerencias(digimonsDisponibles, val));
    }

    function processGuess(name) {
        const found = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === name.toLowerCase()
        );

        if (!found) {
            setResults((prev) => [...prev, { guess: name, error: "Not found" }]);
            return false;
        }

        const comparison = comparacionCompleta(found, digimonObjetivo);
        setResults((prev) => [...prev, { digimon: found, comparacion: comparison }]);

        if (comparison.isCorrect) {
            launchConfetti();
            setGameOver(true); // Game ended: correct guess
        }

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        return true;
    }

    function handleSuggestionClick(name) {
        if (gameOver) return; // Do not allow interaction if game ended
        setGuess(name);
        setSuggestions([]);
        processGuess(name);
        setGuess("");
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (gameOver) return; // Do not allow submit if ended
        if (!guess.trim()) return;
        processGuess(guess.trim());
        setGuess("");
        setSuggestions([]);
    }

    if (loading) return <p className="status-message">Loading data...</p>;
    if (error) return <p className="status-message status-error">Error: {error}</p>;
    if (!digimonObjetivo)
        return (
            <p className="status-message status-error">
                Target Digimon not found.
            </p>
        );

    return (
        <div className="pagina-digimon">
            <h2>Guess the Digimon's Name</h2>

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
                            onClick={() => navigate("/de-quien-es-la-descripcion")}
                            className="success-button"
                        >
                            <span className="button-icon">📝</span>
                        </button>
                    </div>
                </div>
            )}

            <h3>Attempts:</h3>
            <div className="resultados-wrapper">
                <div className="scroll-inner">
                    <div className="resultados-headers">
                        <span>Image</span>
                        <span>Name</span>
                        <span>Level</span>
                        <span>Attribute</span>
                        <span>Type</span>
                        <span>Fields</span>
                        <span>X-Antibody</span>
                        <span>Release Date</span>
                    </div>
                    <ul className="attempts-list">
                        {[...results].reverse().map((r, index) => (
                            <li key={index}>
                                {r.error ? (
                                    <div>
                                        <strong>{r.guess}</strong>: {r.error}
                                    </div>
                                ) : (
                                    <ResultadoCard
                                        digimon={r.digimon}
                                        comparacion={r.comparacion}
                                        animate={index === 0}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
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
