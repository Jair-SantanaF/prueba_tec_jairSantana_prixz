const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { body, validationResult } = require('express-validator');

// Funcion para realizar el registro y validacion de usuarios en base de datos
exports.register = [
    // Validaciones
    body('username').isString().notEmpty().withMessage('El nombre de usuario es requerido').isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    // Función de registro
    (req, res) => {
        // Verifica los errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Si no hay errores, obtenemos los datos del usuario
        const { username, password, email } = req.body;

        // Ciframos la contraseña
        const hashedPassword = bcrypt.hashSync(password, 8);
        const createdAt = new Date().toISOString();

        // Verifica si el nombre de usuario o el correo electrónico ya existen
        const checkUserQuery = `SELECT * FROM Usuarios WHERE username = ? OR email = ?`;
        db.get(checkUserQuery, [username, email], (err, row) => {
            if (err) {
                return res.status(500).json({ message: 'Error al verificar la existencia del usuario' });
            }
            if (row) {
                return res.status(400).json({ message: 'El nombre de usuario o correo ya están en uso' });
            }

            // Inserta el nuevo usuario en la base de datos
            const query = `INSERT INTO Usuarios (username, password, email, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`;
            db.run(query, [username, hashedPassword, email, createdAt, createdAt], function (err) {
                if (err) return res.status(500).json({ message: 'Error al registrar el usuario' });
                res.status(201).json({ message: 'Usuario registrado con éxito' });
            });
        });
    }
];

// Funcion para realizar el incicio de sesion de los usuarios 
exports.login = [
    // Validaciones
    body('username').isString().notEmpty().withMessage('El nombre de usuario es requerido'),
    body('password').isString().notEmpty().withMessage('La contraseña es requerida'),

    // Función de inicio de sesión
    (req, res) => {
        // Verifica los errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        const query = `SELECT * FROM Usuarios WHERE username = ?`;

        // Consulta en la base de datos para obtener el usuario
        db.get(query, [username], (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor al buscar el usuario' });
            }
            if (!user) {
                return res.status(404).json({ message: 'Usuario no registrado' });
            }

            // Compara la contraseña ingresada con la almacenada
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Genera el token JWT si la contraseña es válida
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });

            // Retorna el token como respuesta
            res.status(200).json({ token });
        });
    }
];