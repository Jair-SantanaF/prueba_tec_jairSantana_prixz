const jwt = require('jsonwebtoken');
const db = require('../models/db');  // Importar tu modelo de base de datos

// Inicializamos el middleware que espera un token para validar
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  // Validamos que venga el token en los headers de la solicitud
  // y regresamos un mensaje de error si no existe
  if (!token) return res.status(401).json({ message: 'No token provided' });

  // Separamos el token y hacemos la validacion usando el JWT
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

    // Verificamos si el token ha sido revocado consultando la base de datos
    const query = `SELECT * FROM RevokedTokens WHERE token = ?`;
    db.get(query, [token.split(" ")[1]], (err, row) => {
      if (err) return res.status(500).json({ message: 'Error al verificar el token' });

      if (row) {
        return res.status(401).json({ message: 'Token revocado, por favor inicie sesión nuevamente' });
      }

      // Si el token es válido y no está revocado, almacenamos el ID del usuario
      req.userId = decoded.id;
      next();
    });
  });
};

// Exportamos el authMiddleware para usar después
module.exports = authMiddleware;
