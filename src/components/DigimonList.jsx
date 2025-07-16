import { useEffect, useState } from "react";
import { fetchDigimonList } from "../services/digimonAPI";
import DigimonCard from "./DigimonCard";

export default function DigimonList() {
    const [digimons, setDigimons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDigimonList(0, 1488)
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
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {digimons.map((d) => (
                <DigimonCard key={d.id} digimon={d} />
            ))}
        </div>
    );
}

