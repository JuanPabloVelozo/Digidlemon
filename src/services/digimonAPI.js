export async function fetchDigimonList(page, pageSize) {
    const res = await fetch(`https://digi-api.com/api/v1/digimon?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error("Error al obtener los Digimon");
    const data = await res.json();

    const digimonsConNivel = [];
    for (const d of data.content) {
        const detalleRes = await fetch(d.href);
        if (!detalleRes.ok) throw new Error("Error al obtener detalle del Digimon");
        const detalleData = await detalleRes.json();
        const nivel = detalleData.levels?.[0]?.level || "Desconocido";
        const atributo = detalleData.attributes?.[0]?.attribute || "Desconocido";
        const tipo = detalleData.types?.[0]?.type || "Desconocido";
        const fields = detalleData.fields || [];
        const descripcion = detalleData.descriptions?.[1]?.description || "Desconocido";
        const ataque = detalleData.skills?.[0]?.skill || "Desconocido";  
        const ataqueEscrip = detalleData.skills?.[0]?.description || "Desconocido";
        const fecha = detalleData.releaseDate || "Desconocido";
        const xAntibody = detalleData.xAntibody ?? false;
        digimonsConNivel.push({
            id: d.id,
            name: d.name,
            xAntibody: xAntibody,
            image: d.image,
            level: nivel,
            attribute: atributo,
            type: tipo,
            fields: fields,
            description: descripcion,
            skill: ataque,
            skillDescrip: ataqueEscrip,
            releaseDate: fecha
        });
    }

    return digimonsConNivel;
}

export async function fetchDigimonByName(name) {
    const res = await fetch(`https://digi-api.com/api/v1/digimon/${name}`);
    if (!res.ok) throw new Error("No se encontró el Digimon");
    const data = await res.json();

    const nivel = data.levels?.[0]?.level || "Desconocido";
    const atributo = data.attributes?.[0]?.attribute || "Desconocido";
    const tipo = data.types?.[0]?.type || "Desconocido";
    const fields = data.fields || [];
    const descripcion = data.descriptions?.[1]?.description || "Desconocido";
    const ataque = data.skills?.[0]?.skill || "Desconocido";
    const ataqueEscrip = data.skills?.[0]?.description || "Desconocido";
    const fecha = data.releaseDate || "Desconocido";
    const xAntibody = data.xAntibody ?? false;

    return {
        id: data.id,
        name: data.name,
        xAntibody: xAntibody,
        image: data.image,
        level: nivel,
        attribute: atributo,
        type: tipo,
        fields: fields,
        description: descripcion,
        skill: ataque,
        skillDescrip: ataqueEscrip,
        releaseDate: fecha
    };
}
