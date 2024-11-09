const { body, param, validationResult } = require('express-validator');
const db = require('../models/db');

// Validaciones y función para crear un producto asociado a un usuario
exports.createProduct = [
  // Validaciones
  body('name').isString().notEmpty().withMessage('El nombre del producto es obligatorio'),
  body('description').isString().withMessage('La descripción debe ser un texto'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

  // Función para crear el producto
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price } = req.body;
    const createdAt = new Date().toISOString();
    const query = `INSERT INTO Productos (name, description, price, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [name, description, price, req.userId, createdAt, createdAt], function (err) {
      if (err) return res.status(500).json({ message: 'Error al crear un producto' });
      res.status(201).json({ message: 'Producto creado con éxito', productId: this.lastID });
    });
  }
];

// Función para obtener todos los productos asociados a un usuario
exports.getAllProducts = (req, res) => {
  db.all('SELECT * FROM Productos WHERE userId = ?', [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error obteniendo los productos' });
    res.status(200).json(rows);
  });
};

// Validaciones y función para actualizar un producto por medio de su id y validando que pertenezca al usuario
exports.updateProduct = [
  // Validaciones
  body('name').optional().isString().notEmpty().withMessage('El nombre del producto es obligatorio si se proporciona'),
  body('description').optional().isString().withMessage('La descripción debe ser un texto'),
  body('price').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  param('id').isInt().withMessage('El ID debe ser un número entero'),

  // Función para actualizar el producto
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price } = req.body;
    const updatedAt = new Date().toISOString();
    const query = `UPDATE Productos SET name = ?, description = ?, price = ?, updatedAt = ? WHERE id = ? AND userId = ?`;

    db.run(query, [name, description, price, updatedAt, req.params.id, req.userId], function (err) {
      if (err) return res.status(500).json({ message: 'Error actualizando el producto' });
      if (this.changes === 0) return res.status(404).json({ message: 'Producto no encontrado o no pertenece al usuario' });
      res.json({ message: 'Producto actualizado con éxito' });
    });
  }
];

// Validaciones y función para eliminar un producto por medio de su id y validando que pertenezca al usuario
exports.deleteProduct = [
  // Validación del parámetro ID
  param('id').isInt().withMessage('El ID debe ser un número entero'),

  // Función para eliminar el producto
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = `DELETE FROM Productos WHERE id = ? AND userId = ?`;
    db.run(query, [req.params.id, req.userId], function (err) {
      if (err) return res.status(500).json({ message: 'Error al eliminar el producto' });
      if (this.changes === 0) return res.status(404).json({ message: 'Producto no encontrado o no pertenece al usuario' });
      res.json({ message: 'Producto eliminado con éxito' });
    });
  }
];