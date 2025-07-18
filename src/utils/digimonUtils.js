import sha1 from "sha1";

// Niveles en orden para comparación
export const nivelesOrden = [
    "Baby I", "Baby II", "Child", "Adult", "Perfect", "Ultimate"
];

// Selecciona digimon objetivo usando fecha y clave
export function seleccionarDigimonObjetivo(digimons, fecha, claveSemilla) {
    const cadenaSemilla = fecha.toDateString().toLowerCase().trim() + claveSemilla;
    const hash = sha1(cadenaSemilla);
    const entero = parseInt(hash, 16);
    const index = (entero % digimons.length) - 1;
    const seleccionado = digimons[index < 0 ? 0 : index];

    console.log("Digimon objetivo seleccionado:", seleccionado);

    return seleccionado;
}


// Filtra sugerencias según texto y digimons disponibles
export function filtrarSugerencias(digimonsDisponibles, texto, max = 10) {
    if (texto.length < 1) return [];
    return digimonsDisponibles
        .filter(d => d.name.toLowerCase().startsWith(texto.toLowerCase()))
        .slice(0, max);
}

// Función básica de comparación (solo nombre)
export function comparacionBasica(found, objetivo) {
    return {
        name: { match: found.name.toLowerCase() === objetivo.name.toLowerCase() }
    };
}

// Función completa de comparación para AdivinaNombre.jsx
export function comparacionCompleta(found, objetivo) {
    const posFound = nivelesOrden.indexOf(found.level);
    const posObjetivo = nivelesOrden.indexOf(objetivo.level);

    let levelDirection = null;
    if (posFound !== -1 && posObjetivo !== -1) {
        if (posFound > posObjetivo) levelDirection = "up";
        else if (posFound < posObjetivo) levelDirection = "down";
    }

    return {
        name: { match: found.name.toLowerCase() === objetivo.name.toLowerCase() },
        xAntibody: { match: found.xAntibody === objetivo.xAntibody },
        level: {
            match: found.level.toLowerCase() === objetivo.level.toLowerCase(),
            direction: levelDirection,
        },
        attribute: { match: found.attribute.toLowerCase() === objetivo.attribute.toLowerCase() },
        type: { match: found.type.toLowerCase() === objetivo.type.toLowerCase() },
        fields: {
            match: compararFields(found.fields, objetivo.fields),
            partialMatch: hasAnySharedField(found.fields, objetivo.fields),
        },
        releaseDate: {
            match: parseInt(found.releaseDate) === parseInt(objetivo.releaseDate),
            direction:
                isNaN(found.releaseDate) || isNaN(objetivo.releaseDate)
                    ? null
                    : parseInt(found.releaseDate) > parseInt(objetivo.releaseDate)
                        ? "up"
                        : parseInt(found.releaseDate) < parseInt(objetivo.releaseDate)
                            ? "down"
                            : null,
        },
    };
}

export function hasAnySharedField(userFields, targetFields) {
    const userSet = new Set(userFields.map(f => f.field.toLowerCase()));
    const targetSet = new Set(targetFields.map(f => f.field.toLowerCase()));
    for (let f of userSet) {
        if (targetSet.has(f)) return true;
    }
    return false;
}

export function compararFields(userFields, targetFields) {
    const user = userFields.map(f => f.field.toLowerCase()).sort();
    const target = targetFields.map(f => f.field.toLowerCase()).sort();
    return JSON.stringify(user) === JSON.stringify(target);
}
