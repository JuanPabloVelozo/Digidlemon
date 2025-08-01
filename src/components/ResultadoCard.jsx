import React, { useState, useEffect } from "react";
import "../styles/ResultadoCard.css";

export default function ResultadoCard({ digimon, comparacion, animate = true }) {
    const totalItems = 8;
    const [visibleCount, setVisibleCount] = useState(animate ? 0 : totalItems);
    const [animationStarted, setAnimationStarted] = useState(false);

    useEffect(() => {
        if (!animate) return;

        setVisibleCount(0);
        setAnimationStarted(false);

        const interval = setInterval(() => {
            setVisibleCount((count) => {
                if (count === 0) setAnimationStarted(true);
                if (count < totalItems) {
                    return count + 1;
                } else {
                    clearInterval(interval);
                    return count;
                }
            });
        }, 400);

        return () => clearInterval(interval);
    }, [digimon, comparacion, animate]);

    function icono(ok) {
        return ok ? "status-correct" : "status-wrong";
    }

    function iconoField(fieldsComp) {
        if (fieldsComp.match) return "status-correct";
        if (fieldsComp.partialMatch) return "status-partial";
        return "status-wrong";
    }

    function iconoReleaseDate(releaseDateComp) {
        if (releaseDateComp.match) return "status-correct";
        if (releaseDateComp.direction === "up") return "status-wrong arrow-down";
        if (releaseDateComp.direction === "down") return "status-wrong arrow-up";
        return "status-wrong";
    }

    const elementos = [
        <div
            key="img"
            className={`resultado-card-item ${icono(comparacion.name?.match)}`}
            style={{
                opacity: visibleCount >= 1 ? 1 : 0,
                transition: animationStarted ? "opacity 0.5s ease" : "none",
            }}
        >
            <img src={digimon.image} alt={digimon.name} />
        </div>,

        <div
            key="name"
            className={`resultado-card-item ${icono(comparacion.name?.match)}`}
            style={{
                opacity: visibleCount >= 2 ? 1 : 0,
                transition: animationStarted ? "opacity 0.5s ease" : "none",
            }}
        >
            <span>{digimon.name.replace(/([^\s])\(/g, "$1 (")}</span>
        </div>,

        <div
            key="level"
            className={`resultado-card-item ${iconoReleaseDate(comparacion.level)}`}
            data-arrow={
                comparacion.level.direction === "up"
                    ? "↓"
                    : comparacion.level.direction === "down"
                        ? "↑"
                        : ""
            }
            style={{
                opacity: visibleCount >= 3 ? 1 : 0,
                transition: animationStarted ? "opacity 0.5s ease" : "none",
            }}
        >
            <span>{digimon.level}</span>
        </div>,

        <div
            key="attribute"
            className={`resultado-card-item ${icono(comparacion.attribute.match)}`}
            style={{
                opacity: visibleCount >= 4 ? 1 : 0,
                transition: animationStarted ? "opacity 0.5s ease" : "none",
            }}
        >
            <span>{digimon.attribute}</span>
        </div>,

        <div
            key="type"
            className={`resultado-card-item ${icono(comparacion.type.match)}`}
            style={{
                opacity: visibleCount >= 5 ? 1 : 0,
                transition: animationStarted ? "opacity 0.5s ease" : "none",
            }}
        >
            <span>{digimon.type}</span>
        </div>,

        <div
            key="fields"
            className={`resultado-card-item ${iconoField(comparacion.fields)}`}
            style={{
                opacity: visibleCount >= 6 ? 1 : 0,
                transition: animationStarted ? "opacity 0.5s ease" : "none",
            }}
        >
            <span className="resultado-icon"> </span>
            <span>{digimon.fields.map((f) => f.field).join(", ") || "Unknown"}</span>
        </div>,

        <div
            key="xAntibody"
            className={`resultado-card-item ${icono(comparacion.xAntibody.match)}`}
            style={{
                opacity: visibleCount >= 7 ? 1 : 0,
                transition: animationStarted ? "opacity 0.5s ease" : "none",
            }}
        >
            <span className="resultado-icon"> </span>
            <span>{digimon.xAntibody ? "Sí" : "No"}</span>
        </div>,

        <div
            key="releaseDate"
            className={`resultado-card-item ${iconoReleaseDate(comparacion.releaseDate)}`}
            data-arrow={
                comparacion.releaseDate.direction === "up"
                    ? "↓"
                    : comparacion.releaseDate.direction === "down"
                        ? "↑"
                        : ""
            }
            style={{
                opacity: visibleCount >= 8 ? 1 : 0,
                transition: animationStarted ? "opacity 0.5s ease" : "none",
            }}
        >
            <span>{digimon.releaseDate}</span>
        </div>,
    ];

    return <div className="resultado-card">{elementos}</div>;
}
