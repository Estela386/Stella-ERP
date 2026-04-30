const iaService = require('./services/ia.service.js');
require('dotenv').config();

async function run() {
    try {
        const imagenBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        const result = await iaService.generarDescripcionProducto({
            imagenBase64,
            tipo: "Dije",
            material: "Oro",
            color: "Dorado",
            dimensiones: "No especificado",
            estilo: "Elegante",
            detallesAdicionales: "Ninguno"
        });
        console.log("ÉXITO:", result);
    } catch (e) {
        console.error("ERROR:", e);
    }
}
run();
