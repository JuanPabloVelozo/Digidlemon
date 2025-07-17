import { useEffect, useState } from "react";
import { fetchDigimonList } from "../services/digimonAPI";
import ResultadoCard from "./ResultadoCard";
import "../styles/AdivinaNombre.css";

export default function AdivinaNombre() {
    // Estados principales para almacenar datos y controlar la UI
    const [digimons, setDigimons] = useState([]);                 // Lista completa de Digimons cargados
    const [digimonsDisponibles, setDigimonsDisponibles] = useState([]); // Digimons que aún no han sido usados como intento
    const [loading, setLoading] = useState(true);                 // Estado de carga para mostrar indicador
    const [guess, setGuess] = useState("");                       // Valor actual del input de nombre
    const [results, setResults] = useState([]);                   // Resultados de intentos realizados
    const [digimonObjetivo, setDigimonObjetivo] = useState(null); // Digimon que hay que adivinar
    const [error, setError] = useState("");                        // Mensajes de error al cargar datos
    const [suggestions, setSuggestions] = useState([]);           // Lista de sugerencias para autocompletar

    // Carga la lista de Digimons al montar el componente
    useEffect(() => {
        fetchDigimonList(0, 1488) // Obtiene Digimons desde el API
            .then((list) => {
                setDigimons(list);
                setDigimonsDisponibles(list);

                // Establece el Digimon objetivo, en este caso "death-x-mon"
                const deathXmon = list.find((d) => d.name.toLowerCase() === "death-x-mon");
                setDigimonObjetivo(deathXmon);

                setLoading(false);
            })
            .catch((err) => {
                // Si hay error, se muestra mensaje y se termina carga
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Maneja cambio en input: actualiza guess y filtra sugerencias
    function handleInputChange(e) {
        const val = e.target.value;
        setGuess(val);

        if (val.length < 1) {
            setSuggestions([]);
            return;
        }

        // Filtra los digimons disponibles cuyo nombre empieza con el texto ingresado (máximo 5)
        const filtered = digimonsDisponibles
            .filter((d) => d.name.toLowerCase().startsWith(val.toLowerCase()))
            .slice(0, 5);

        setSuggestions(filtered);
    }

    // Maneja click en una sugerencia: selecciona ese digimon y agrega resultado
    function handleSuggestionClick(name) {
        setGuess(name);
        setSuggestions([]);

        // Busca el digimon seleccionado entre los disponibles
        const found = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === name.toLowerCase()
        );

        if (!found) {
            // Si no existe, agrega un resultado con error
            setResults((prev) => [...prev, { guess: name, error: "No encontrado" }]);
            return;
        }

        // Calcula comparación entre digimon seleccionado y el objetivo
        const comparacion = getComparacion(found, digimonObjetivo);

        // Añade el intento con su comparación a resultados
        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        // Remueve digimon usado de la lista de disponibles para evitar repetidos
        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess(""); // Limpia el input
    }

    // Maneja el envío del formulario cuando el usuario presiona "Probar"
    function handleSubmit(e) {
        e.preventDefault();

        // Busca el digimon escrito en el input dentro de los disponibles
        const found = digimonsDisponibles.find(
            (d) => d.name.toLowerCase() === guess.trim().toLowerCase()
        );

        if (!found) {
            // Si no se encuentra, agrega error en resultados
            setResults((prev) => [...prev, { guess: guess, error: "No encontrado" }]);
            setGuess("");
            setSuggestions([]);
            return;
        }

        // Calcula comparación para el digimon encontrado y el objetivo
        const comparacion = getComparacion(found, digimonObjetivo);

        // Añade intento con comparación a resultados
        setResults((prev) => [...prev, { digimon: found, comparacion }]);

        // Quita digimon usado de disponibles para evitar repetir intento
        setDigimonsDisponibles((prev) =>
            prev.filter((d) => d.name.toLowerCase() !== found.name.toLowerCase())
        );

        setGuess("");        // Limpia input
        setSuggestions([]);  // Limpia sugerencias
    }

    // Función que compara características entre dos digimons y retorna objeto con resultados
    function getComparacion(found, objetivo) {
        return {
            xAntibody: { match: found.xAntibody === objetivo.xAntibody },
            level: { match: found.level.toLowerCase() === objetivo.level.toLowerCase() },
            attribute: { match: found.attribute.toLowerCase() === objetivo.attribute.toLowerCase() },
            type: { match: found.type.toLowerCase() === objetivo.type.toLowerCase() },
            fields: {
                match: compareFields(found.fields, objetivo.fields),
                partialMatch: hasAnySharedField(found.fields, objetivo.fields),
            },
            releaseDate: {
                match: parseInt(found.releaseDate) === parseInt(objetivo.releaseDate),
                direction:
                    parseInt(found.releaseDate) > parseInt(objetivo.releaseDate) ? "up" : "down",
            },
        };
    }

    // Devuelve true si hay al menos un campo compartido entre los dos arrays de fields
    function hasAnySharedField(userFields, targetFields) {
        const userSet = new Set(userFields.map(f => f.field.toLowerCase()));
        const targetSet = new Set(targetFields.map(f => f.field.toLowerCase()));
        for (let f of userSet) {
            if (targetSet.has(f)) return true;
        }
        return false;
    }

    // Compara que ambos arrays de fields sean iguales (sin importar orden)
    function compareFields(userFields, targetFields) {
        const user = userFields.map(f => f.field.toLowerCase()).sort();
        const target = targetFields.map(f => f.field.toLowerCase()).sort();
        return JSON.stringify(user) === JSON.stringify(target);
    }

    // Renderizado condicional basado en estados de carga y error
    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!digimonObjetivo) return <p>No se encontró al Digimon objetivo.</p>;

    // Renderizado principal del componente
    return (
        <div>
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
                {/* Lista de sugerencias que aparecen mientras se escribe */}
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((sug) => (
                            <li
                                key={sug.id}
                                onClick={() => handleSuggestionClick(sug.name)}
                                onMouseDown={(e) => e.preventDefault()} // Previene perder foco en input
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
                    {[...results].reverse().map((r, index) => (
                        <li key={index}>
                            {r.error ? (
                                <div><strong>{r.guess}</strong>: {r.error}</div>
                            ) : (
                                <ResultadoCard digimon={r.digimon} comparacion={r.comparacion} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
