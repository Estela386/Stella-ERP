/**
 * EJEMPLO DE INTEGRACIÓN FRONTEND
 * 
 * Este archivo contiene funciones de utilidad para conectar el panel de administración
 * con el nuevo backend de IA.
 */

/**
 * Convierte un objeto File (de un input type="file") a una cadena base64.
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result?.toString().split(',')[1];
            resolve(base64String || '');
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Ejemplo de función para llamar al endpoint de generación de producto.
 */
export const generarDescripcionIA = async (data: {
    imagen: File;
    tipo: string;
    material: string;
    color: string;
    dimensiones: string;
    estilo: string;
    detallesAdicionales: string;
}) => {
    try {
        // 1. Convertir imagen a base64
        const imagenBase64 = await convertFileToBase64(data.imagen);

        // 2. Llamar al backend
        const response = await fetch('http://localhost:4000/api/generar-producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imagenBase64,
                tipo: data.tipo,
                material: data.material,
                color: data.color,
                dimensiones: data.dimensiones,
                estilo: data.estilo,
                detallesAdicionales: data.detallesAdicionales,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al generar la descripción');
        }

        const result = await response.json();
        
        /**
         * Estructura del resultado:
         * {
         *   "nombre": "...",
         *   "descripcion": "...",
         *   "especificaciones": ["...", "...", "..."]
         * }
         */
        return result;

    } catch (error) {
        console.error('Error al usar la IA:', error);
        throw error;
    }
};

/**
 * EJEMPLO DE USO EN UN COMPONENTE REACT:
 * 
 * const handleGenerate = async () => {
 *   setIsLoading(true);
 *   try {
 *     const aiResult = await generarDescripcionIA({
 *       imagen: selectedFile,
 *       tipo: 'Anillo',
 *       material: 'Oro 18k',
 *       color: 'Dorado',
 *       dimensiones: 'Talla 7',
 *       estilo: 'Minimalista',
 *       detallesAdicionales: 'Incrustación de diamante pequeño'
 *     });
 *     
 *     // Rellenar el formulario con los resultados
 *     setFormData({
 *       nombre: aiResult.nombre,
 *       descripcion: aiResult.descripcion,
 *       especificaciones: aiResult.especificaciones.join('\n')
 *     });
 *   } catch (err) {
 *     toast.error('No se pudo generar la descripción');
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 */
