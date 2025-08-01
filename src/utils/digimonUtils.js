import sha1 from "sha1";

// Niveles en orden para comparación
export const nivelesOrden = [
    "Baby I", "Baby II", "Child", "Adult", "Perfect", "Ultimate"
];

// Selecciona digimon objetivo usando fecha y clave
export function seleccionarDigimonObjetivo(digimons, fecha, claveSemilla) {
    let cadenaSemilla = fecha.toDateString().toLowerCase().trim() + claveSemilla;//crea la semilla inicial
    let seleccionado=0;//let para digimon seleccionado
    let validar=true;//inicia ciclo de seleccion para un digimon valido
    while (validar) {
        validar=false
        let hash = sha1(cadenaSemilla);//transforma la semilla en un hash
        let entero = parseInt(hash, 16);//convierte el hash a entero
        let index = (entero % digimons.length) - 1;//obtiene un indice del hash
        seleccionado = digimons[index < 0 ? 0 : index];//selecciona el digimon de la lista
        // Verifica que el digimon tenga datos completos
        if(seleccionado.skillDescrip==="Unknown" || seleccionado.description==="Unknown"){
            cadenaSemilla += cadenaSemilla;//en caso de que el digimon no tenga datos completos, se agrega la semilla a si misma
            validar=true;
        }
    }
    console.log("Selected target digimon:", seleccionado.name);

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
    const nameMatch = found.name.toLowerCase() === objetivo.name.toLowerCase();
    return {
        name: { match: nameMatch },
        isCorrect: nameMatch,
    };
}


export function comparacionCompleta(found, objetivo) {
    const posFound = nivelesOrden.indexOf(found.level);
    const posObjetivo = nivelesOrden.indexOf(objetivo.level);

    let levelDirection = null;
    if (posFound !== -1 && posObjetivo !== -1) {
        if (posFound > posObjetivo) levelDirection = "up";
        else if (posFound < posObjetivo) levelDirection = "down";
    }

    const nameMatch = found.name.toLowerCase() === objetivo.name.toLowerCase();

    return {
        name: { match: nameMatch },
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
        isCorrect: nameMatch,  
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


export function icono(comparacion) {
    if (!comparacion) return "";
    if (comparacion.name.match) return "status-correct";
    return "status-wrong";
}

// Función para generar confeti reutilizable
export const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#577590"];

export function generarConfeti(windowWidth, cantidad = 60) {
    return Array.from({ length: cantidad }).map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        left: Math.random() * windowWidth,
        delay: Math.random(),
        colorIndex: Math.floor(Math.random() * colors.length),
    }));
}

export function verifyDateFromLocalStorage(fecha, juego) {
    const date = fecha.toDateString().toLowerCase().trim();
    const storedDate = new Date(Date.parse(localStorage.getItem(juego))).toDateString().toLowerCase().trim() || null;
    if(date === null || date!==storedDate ) {
        localStorage.setItem(juego, date);
        return true;
    }

    return false;
}