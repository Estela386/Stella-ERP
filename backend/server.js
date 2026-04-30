require('dotenv').config();
const express = require('express');
const cors = require('cors');
const iaRoutes = require('./routes/ia.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentamos el límite para recibir base64 de imágenes grandes

// Rutas
app.use((req, res, next) => {
    console.log(`Petición recibida: ${req.method} ${req.url}`);
    next();
});
app.use('/api', iaRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Stella ERP AI Backend is running' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal en el servidor',
        message: err.message 
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de IA corriendo en http://localhost:${PORT}`);
});
