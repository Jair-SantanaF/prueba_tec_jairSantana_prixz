const { body, param, validationResult } = require('express-validator');
const db = require('../models/db');

// Función para obtener todos los usuarios registrados
exports.getAllUsers = (req, res) => {
  db.all('SELECT id, username, email, createdAt, updatedAt FROM Usuarios', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error al obtener todos los usuarios' });
    res.status(200).json(rows);
  });
};

// Validaciones y función para actualizar los datos de un usuario por medio de su id
exports.updateUser = [
  // Validaciones
  body('username').isString().notEmpty().withMessage('El nombre de usuario es requerido'),
  body('email').isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
  param('id').isInt().withMessage('El ID debe ser un número entero'),

  // Función de actualización
  (req, res) => {
    // Manejo de errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email } = req.body;
    const updatedAt = new Date().toISOString();
    const query = `UPDATE Usuarios SET username = ?, email = ?, updatedAt = ? WHERE id = ?`;

    db.run(query, [username, email, updatedAt, req.params.id], function (err) {
      if (err) return res.status(500).json({ message: 'Error al actualizar el usuario' });
      if (this.changes === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json({ message: 'Usuario actualizado con éxito' });
    });
  }
];

// Validaciones y función para eliminar un usuario por medio de su id
exports.deleteUser = [
  // Validación del parámetro ID
  param('id').isInt().withMessage('El ID debe ser un número entero'),

  // Función de eliminación
  (req, res) => {
    // Manejo de errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = `DELETE FROM Usuarios WHERE id = ?`;
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token de la cabecera
  
    db.run(query, [req.params.id], function (err) {
      if (err) return res.status(500).json({ message: 'Error al eliminar el usuario' });
  
      // Insertar el token en la tabla de tokens revocados
      const revokeQuery = `INSERT INTO RevokedTokens (token) VALUES (?)`;
      db.run(revokeQuery, [token], function (err) {
        if (err) return res.status(500).json({ message: 'Error al revocar el token' });
        
        res.json({ message: 'Usuario eliminado con éxito' });
      });
    });
  }
];