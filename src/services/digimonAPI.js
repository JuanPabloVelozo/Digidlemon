
export async function fetchDigimonList(page, pageSize) {
    const res = await fetch(`https://digi-api.com/api/v1/digimon?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error("Error fetching Digimon");
    const data = await res.json();

    const digimonsConNivel = [];
    for (const d of data.content) {
        const detalleRes = await fetch(d.href);
        if (!detalleRes.ok) throw new Error("Error fetching Digimon details");
        const detalleData = await detalleRes.json();
        const nivel = detalleData.levels?.[0]?.level || "Unknown";
        const atributo = detalleData.attributes?.[0]?.attribute || "Unknown";
        const tipo = detalleData.types?.[0]?.type || "Unknown";
        const fields = detalleData.fields || [];
        let descripcion = detalleData.descriptions?.[1]?.description || "Unknown";

        const nombreBase = d.name.replace(/\(.*?\)/g, '').replace(/-.*$/g, '').trim();        
        if (nombreBase && descripcion.toLowerCase().includes(nombreBase.toLowerCase())) {
            const regexNombreBase = new RegExp(`\\b${escapeRegExp(nombreBase)}\\b`, "gi");
            descripcion = descripcion.replace(regexNombreBase, "****");
        }
        const ataque = detalleData.skills?.[0]?.skill || "Unknown";
        const ataqueEscrip = detalleData.skills?.[0]?.description || "Unknown";
        const fecha = detalleData.releaseDate || "Unknown";
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
    localStorage.setItem("digimonList", JSON.stringify(digimonsConNivel));
    return digimonsConNivel;
}

export async function fetchDigimonByName(name) {
    const res = await fetch(`https://digi-api.com/api/v1/digimon/${name}`);
    if (!res.ok) throw new Error("Digimon not found");
    const data = await res.json();

    const nivel = data.levels?.[0]?.level || "Unknown";
    const atributo = data.attributes?.[0]?.attribute || "Unknown";
    const tipo = data.types?.[0]?.type || "Unknown";
    const fields = data.fields || [];
    let descripcion = data.descriptions?.[1]?.description || "Unknown";
    descripcion = ocultarNombreEnDescripcion(data.name, descripcion);
    const ataque = data.skills?.[0]?.skill || "Unknown";
    const ataqueEscrip = data.skills?.[0]?.description || "Unknown";
    const fecha = data.releaseDate || "Unknown";
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