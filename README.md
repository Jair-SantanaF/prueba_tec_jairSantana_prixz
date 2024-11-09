# Node.js API Prueba Técnica

## Descripción

Esta es una API RESTful desarrollada con Node.js, Express y SQLite. Incluye autenticación JWT y permite operaciones CRUD para usuarios y productos con validaciones especificas para cada
solicitud realizada.

## Tecnologías utilizadas

- Node.js
- Express
- SQLite
- JWT (jsonwebtoken)
- bcrypt (para cifrar contraseñas)
- express-validator (para validación de datos)

## Instalación

1. Clonar el repositorio:
   ```bash
   [git clone https://github.com/tu-repo/nodejs-api-prueba.git](https://github.com/Jair-SantanaF/prueba_tec_jairSantana_prixz.git)
   cd nodejs-api-prueba

2. Navega al directorio del proyecto:
    cd prueba_tec_jairSantana_prixz

3. Instala las dependencias:
    npm install

4. Solcitar archivo .env para variables de entorno

5. Ejecutar proyecto:
    npm start

## Endpoints

1. Registro de Usuario
    Ruta: /api/register
    Método: POST
    Descripción: Registra un nuevo usuario. La contraseña se almacena de forma cifrada.
    Cuerpo de la Solicitud:
        {
            "username": "string",
            "password": "string",
            "email": "string"
        }
    Respuesta:
    201 Created:
        { "message": "Usuario registrado con éxito" }

2. Inicio de Sesión
    Ruta: /api/login
    Método: POST
    Descripción: Inicia sesión y devuelve un token JWT si las credenciales son correctas.
    Cuerpo de la Solicitud:
        {
            "username": "string",
            "password": "string"
        }
    Respuesta:
    200 OK:
        { "token": "jwt_token" }

3. Obtener Usuarios
    Ruta: /api/users
    Método: GET
    Descripción: Devuelve una lista de todos los usuarios registrados. Protegido por JWT.
    Respuesta:
        [
            {
                "id": 1,
                "username": "string",
                "email": "string",
                "createdAt": "datetime",
                "updatedAt": "datetime"
            },
            ...
        ]

4. Actualizar Usuario
    Ruta: /api/users/:id
    Método: PUT
    Descripción: Actualiza los datos de un usuario. Protegido por JWT.
    Cuerpo de la Solicitud:
        {
            "username": "string",
            "email": "string"
        }
    Respuesta:
    200 OK:
        { "message": "Usuario actualizado con éxito" }

5. Eliminar Usuario
    Ruta: /api/users/:id
    Método: DELETE
    Descripción: Elimina un usuario por su ID. Protegido por JWT.
    Respuesta:
    200 OK:
        { "message": "Usuario eliminado con éxito" }

6. Crear Producto
    Ruta: /api/products
    Método: POST
    Descripción: Permite a un usuario autenticado crear un nuevo producto. Protegido por JWT.
    Cuerpo de la Solicitud:
        {
            "name": "string",
            "description": "string",
            "price": number
        }
    Respuesta:
    201 Created:
        { "message": "Producto creado con éxito", "productId": "id" }

7. Obtener Productos
    Ruta: /api/products
    Método: GET
    Descripción: Devuelve una lista de todos los productos asociados al usuario autenticado. Protegido por JWT.
    Respuesta:
        [
            {
                "id": 1,
                "name": "string",
                "description": "string",
                "price": number,
                "createdAt": "datetime",
                "updatedAt": "datetime"
            },
            ...
        ]

8. Actualizar Producto
    Ruta: /api/products/:id
    Método: PUT
    Descripción: Permite actualizar un producto que pertenece al usuario autenticado. Protegido por JWT.
    Cuerpo de la Solicitud:
        {
            "name": "string",
            "description": "string",
            "price": number
        }
    Respuesta:
    200 OK:
        { "message": "Producto actualizado con éxito" }

9. Eliminar Producto
    Ruta: /api/products/:id
    Método: DELETE
    Descripción: Permite eliminar un producto que pertenece al usuario autenticado. Protegido por JWT.
    Respuesta:
    200 OK:
    { "message": "Producto eliminado con éxito" }

## Manejo de errores 

-- La API devuelve errores con mensajes claros y códigos de estado HTTP adecuados.
    * 400 para errores de validación o datos faltantes.
    * 401 para intentos de acceso no autorizado.
    * 404 si no se encuentra el recurso solicitado.
    * 500 para errores internos del servidor.

## Notas

1. Protección de Endpoints: Los endpoints de productos y algunos de usuario están protegidos por JWT; enviar el token en el encabezado Authorization como Bearer token.

2. Relación Usuario-Producto: Cada producto está asociado con un usuario a través del campo userId, asegurando que solo el propietario pueda modificar o eliminar sus productos.

## Pruebas

Se proporciona una coleccion completa para el software Postman que tiene todos y cada uno de los enpoints ya listos para ser ejecutados. Estos endpoints han sido probados previamiente con resultados satisfactorios deacuerdo a las indicaciones de la prueba tecnica.
