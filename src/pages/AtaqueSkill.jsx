import { useEffect, useState } from "react";
import { fetchDigimonList } from "../services/digimonAPI";
import {
    seleccionarDigimonObjetivo,
    filtrarSugerencias,
    comparacionBasica,
    icono
} from "../utils/digimonUtils";
import "../styles/main.css";
import ResultadoSimple from "./ResultadoSimple"; // Ajusta la ruta si es necesario

export default function DescripcionGame() {
    const [digimonsDisponibles, setDigimonsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [guess, setGuess] = useState("");
    const [results, setResults] = useState([]);
    const [digimonObjetivo, setDigimonObjetivo] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [fecha] = useState(new Date());

    useEffect(() => {
        if (localStorage.getItem("digimonList") !== null) {
            try {
                let digi = [];
                digi = JSON.parse(localStorage.getItem("digimonList"));
                setDigimonsDisponibles(digi);
                const objetivo = seleccionarDigimonObjetivo(digi, fecha, "furryhumi");
                setDigimonObjetivo(objetivo);
                setLoading(false);
            }
            catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        else{    
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
            return;
        }

        procesarAdivinanza(found);
    }

    function procesarAdivinanza(found) {
        const comparacion = comparacionBasica(found, digimonObjetivo);
        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");
        setSuggestions([]);
    }


    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!digimonObjetivo) return <p>No se encontró al Digimon objetivo.</p>;
    if (!digimonObjetivo.description || digimonObjetivo.description === "Desconocido")
        return <p>El Digimon objetivo no tiene descripción válida.</p>;

    return (
        <div className="container">
            <h2>¿De quién es el ataque?</h2>

            <div className="description-box">
                <h4>{digimonObjetivo.skill}</h4>
                <p>{digimonObjetivo.skillDescrip}</p>
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
                                    status={r.comparacion}  // Aquí pasamos el objeto completo
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
