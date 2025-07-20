import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDigimonList } from "../services/digimonAPI";
import {
    seleccionarDigimonObjetivo,
    filtrarSugerencias,
    comparacionBasica,
    icono,
    generarConfeti,
    colors,
} from "../utils/digimonUtils";
import "../styles/main.css";
import ResultadoSimple from "./ResultadoSimple";

export default function AdivinaSilueta() {
    const [digimonsDisponibles, setDigimonsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [guess, setGuess] = useState("");
    const [results, setResults] = useState([]);
    const [digimonObjetivo, setDigimonObjetivo] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [fecha] = useState(new Date());
    const [nivelRevelado, setNivelRevelado] = useState(0); // 0-50 niveles

    const [confettiPieces, setConfettiPieces] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("digimonList") !== null) {
            try {
                const digi = JSON.parse(localStorage.getItem("digimonList"));
                setDigimonsDisponibles(digi);
                const objetivo = seleccionarDigimonObjetivo(digi, fecha, "manqueque");
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
                    const objetivo = seleccionarDigimonObjetivo(list, fecha, "manqueque");
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
            aumentarRevelado();
            return;
        }

        procesarAdivinanza(found);
    }

    function aumentarRevelado() {
        setNivelRevelado((prev) => Math.min(50, prev + 1));
    }

    function procesarAdivinanza(found) {
        const comparacion = comparacionBasica(found, digimonObjetivo);
        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        if (comparacion.name.match) {
            setNivelRevelado(50); // Revelado completo si acierta
            launchConfetti();
            setGameOver(true);
        } else {
            aumentarRevelado();
        }

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");
        setSuggestions([]);
    }

    // Función para obtener desplazamiento basado en la fecha
    function getTranslateFromDate(date, maxTranslate) {
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");

        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            hash = (hash * 31 + dateStr.charCodeAt(i)) % 1000;
        }

        const translateX = hash % maxTranslate;
        const translateY = (hash * 7) % maxTranslate;

        return { translateX, translateY };
    }

    function handleContinue() {
        navigate("/gameover"); // Cambia ruta a lo que necesites
    }

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!digimonObjetivo) return <p>No se encontró al Digimon objetivo.</p>;

    const containerSize = 300;
    const maxNivel = 50;
    const maxTranslate = 90;

    const scale = 3 - (nivelRevelado * (2 / maxNivel));

    const { translateX: baseTranslateX, translateY: baseTranslateY } = getTranslateFromDate(fecha, maxTranslate);

    const translateX = (maxNivel - nivelRevelado) * (baseTranslateX / maxNivel);
    const translateY = (maxNivel - nivelRevelado) * (baseTranslateY / maxNivel);

    return (
        <div className="container" style={{ position: "relative" }}>
            <h2>¿Quién es este Digimon?</h2>
            <div className="imagen-box">
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
                            onClick={() => navigate("/")}  
                            className="success-button"
                        >
                            <span className="button-icon">🏠</span>
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
