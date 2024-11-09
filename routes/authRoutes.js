const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Usamos el router y el controlador para dirigir las peticiones a las funciones correspondientes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;