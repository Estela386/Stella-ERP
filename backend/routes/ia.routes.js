const express = require('express');
const router = express.Router();
const iaController = require('../controllers/ia.controller');

// Endpoint: POST /api/generar-producto
router.post('/generar-producto', iaController.generarProducto);

module.exports = router;
