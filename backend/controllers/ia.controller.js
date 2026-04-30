const iaService = require('../services/ia.service');

class IAController {
    async generarProducto(req, res) {
        try {
            const { 
                imagenBase64, 
                tipo, 
                material, 
                color, 
                dimensiones, 
                estilo, 
                detallesAdicionales 
            } = req.body;

            // Validación de campos obligatorios
            if (!imagenBase64) {
                return res.status(400).json({ error: 'La imagen en base64 es obligatoria' });
            }

            if (!tipo || !material || !color) {
                return res.status(400).json({ error: 'Tipo, material y color son campos obligatorios' });
            }

            const resultado = await iaService.generarDescripcionProducto({
                imagenBase64,
                tipo,
                material,
                color,
                dimensiones: dimensiones || 'No especificado',
                estilo: estilo || 'Moderno',
                detallesAdicionales: detallesAdicionales || 'Ninguno'
            });

            return res.status(200).json(resultado);

        } catch (error) {
            console.error('Error en IAController:', error);
            return res.status(500).json({ 
                error: 'Error al generar la descripción del producto',
                details: error.message 
            });
        }
    }
}

module.exports = new IAController();
