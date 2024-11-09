const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

// Configuracion de las rutas y uso de express
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

module.exports = app;