export async function fetchDigimonList(page = 0, pageSize = 100) {
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
        digimonsConNivel.push({
            id: d.id,
            name: d.name,
            image: d.image,
            level: nivel,
            attribute: atributo

        });
    }

    return digimonsConNivel;
}
