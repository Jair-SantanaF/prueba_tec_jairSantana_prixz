const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Obtener todos los usuarios - Protegido con JWT
router.get('/', authMiddleware, userController.getAllUsers);

// Actualizar usuario - Protegido con JWT
router.put('/:id', authMiddleware, userController.updateUser);

// Eliminar usuario - Protegido con JWT
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;