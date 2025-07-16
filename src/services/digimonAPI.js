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
