import { useEffect, useState } from "react";
import { fetchDigimonList } from "../services/digimonAPI";

export default function DigimonList() {
    const [digimons, setDigimons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDigimonList(0, 100)
            .then((list) => {
                setDigimons(list);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando Digimons...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {digimons.map(d => (
                <li key={d.id} style={{ marginBottom: "1rem" }}>
                    <p>ID: {d.id}</p>
                    <p>Nombre: {d.name}</p>
                    <img src={d.image} alt={d.name} style={{ width: "100px", height: "100px" }} />
                    <p>Nivel: {d.level}</p>
                    <p>Atributo: {d.attribute}</p>
                </li>
            ))}
        </ul>
    );
}

