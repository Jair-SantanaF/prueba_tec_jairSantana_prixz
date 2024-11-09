const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Generamos en nuestro archivo de base de datos la serializacion que nos ayuda a 
// tener una mejor historia de interaccion con base de datos
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT UNIQUE,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      userId INTEGER,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(userId) REFERENCES Usuarios(id)
    );
  `);

  db.run(`
    CREATE TABLE RevokedTokens (
        token TEXT PRIMARY KEY,
        revokedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

module.exports = db;