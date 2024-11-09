const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

// Crear producto - Protegido con JWT
router.post('/', authMiddleware, productController.createProduct);

// Obtener todos los productos del usuario autenticado - Protegido con JWT
router.get('/', authMiddleware, productController.getAllProducts);

// Actualizar producto - Protegido con JWT y solo por el propietario del producto
router.put('/:id', authMiddleware, productController.updateProduct);

// Eliminar producto - Protegido con JWT y solo por el propietario del producto
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;