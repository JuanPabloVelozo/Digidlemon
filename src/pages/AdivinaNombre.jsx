import { useEffect, useState } from "react";
import { fetchDigimonList } from "../services/digimonAPI";
import ResultadoCard from "./ResultadoCard";
import "../styles/AdivinaNombre.css";
import {
    seleccionarDigimonObjetivo,
    filtrarSugerencias,
    comparacionCompleta,
} from "../utils/digimonUtils";

export default function AdivinaNombre() {
    const [digimons, setDigimons] = useState([]);
    const [digimonsDisponibles, setDigimonsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guess, setGuess] = useState("");
    const [results, setResults] = useState([]);
    const [digimonObjetivo, setDigimonObjetivo] = useState(null);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [fecha] = useState(new Date());

    useEffect(() => {
        //localStorage.clear();
        if (localStorage.getItem("digimonList") !== null) {
            try {
                let digi = [];
                digi = JSON.parse(localStorage.getItem("digimonList"));
                setDigimons(digi);
                setDigimonsDisponibles(digi);
                let objetivo = seleccionarDigimonObjetivo(digi, fecha, "gordoputo");
                setDigimonObjetivo(objetivo);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        else {

            fetchDigimonList(0, 1488)
                .then((list) => {

                    setDigimons(list);
                    setDigimonsDisponibles(list);

                    let objetivo = seleccionarDigimonObjetivo(list, fecha, "gordoputo");
                    setDigimonObjetivo(objetivo);

                    console.log(JSON.parse(localStorage.getItem("digimonList")));
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });


        }
    }, [fecha]);

    function handleInputChange(e) {
        const val = e.target.value;
        setGuess(val);

        if (val.length < 1) {
            setSuggestions([]);
            return;
        }
        setSuggestions(filtrarSugerencias(digimonsDisponibles, val));
    }

    function handleSuggestionClick(name) {
        setGuess(name);
        setSuggestions([]);

        const found = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === name.toLowerCase()
        );

        if (!found) {
            setResults((prev) => [...prev, { guess: name, error: "No encontrado" }]);
            return;
        }

        const comparacion = comparacionCompleta(found, digimonObjetivo);

        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");
    }

    function handleSubmit(e) {
        e.preventDefault();

        const found = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === guess.trim().toLowerCase()
        );

        if (!found) {
            setResults((prev) => [...prev, { guess: guess, error: "No encontrado" }]);
            setGuess("");
            setSuggestions([]);
            return;
        }

        const comparacion = comparacionCompleta(found, digimonObjetivo);

        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");
        setSuggestions([]);
    }

    if (loading) return <p className="status-message">Cargando datos...</p>;
    if (error) return <p className="status-message status-error">Error: {error}</p>;
    if (!digimonObjetivo) return <p className="status-message status-error">No se encontró al Digimon objetivo.</p>;

    return (
        <div className="pagina-digimon">
            <h2>Adivina el Nombre del Digimon</h2>
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
            <div className="resultados-wrapper">
                <div className="scroll-inner">
                    <div className="resultados-headers">
                        <span>Imagen</span>
                        <span>Nombre</span>
                        <span>Nivel</span>
                        <span>Atributo</span>
                        <span>Tipo</span>
                        <span>Fields</span>
                        <span>X-Antibody</span>
                        <span>Release Date</span>
                    </div>
                    <ul className="attempts-list">
                        {[...results].reverse().map((r, index, arr) => (
                            <li key={index}>
                                {r.error ? (
                                    <div>
                                        <strong>{r.guess}</strong>: {r.error}
                                    </div>
                                ) : (
                                    <ResultadoCard
                                        digimon={r.digimon}
                                        comparacion={r.comparacion}
                                        animate={index === 0} // solo el primero (último intentado) anima
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}