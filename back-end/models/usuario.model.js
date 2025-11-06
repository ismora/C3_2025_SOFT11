// Modelo (esqueleto, estructura) de lo que se almacenará en la BD
// Usuario: correo (string), nombre (string), cédula (string), celular (number), contraseña (string)

const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

// Creación del esquema
const schemaUsuario = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        unique: false
    },
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    celular: {
        type: Number,
        required: true
    }, 
    contrasenia: {
        type: String, 
        required: true
    }
});

const Usuario = mongoose.model("Usuario", schemaUsuario);
module.exports = Usuario; 