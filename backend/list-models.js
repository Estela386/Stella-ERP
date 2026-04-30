require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            console.error("Error al listar modelos:", data);
            return;
        }

        console.log("=== MODELOS DISPONIBLES EN TU CUENTA ===");
        data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name.replace('models/', '')} (${m.displayName})`);
            }
        });
        console.log("========================================");
    } catch (error) {
        console.error("Error de conexión:", error.message);
    }
}

listModels();
