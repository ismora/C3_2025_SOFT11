//Producto: código (string), nombre (string), precio (number), marca (string), cantidadDisponible (number), enInventario (boolean)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creación del esquema
const productoSchema = new mongoose.Schema({
    codigo: {
        type: String, 
        required: true, 
        unique: true
    },
    nombreProducto: {
        type: String, 
        required: true
    },
    precio: {
        type: Number, 
        required: true 
    },
    marca: {
        type: String, 
        required: true
    },
    cantidadDisponible: {
        type: Number, 
        required: true
    },
    enInventario: {
        type: Boolean, 
        required: true
    }
});

//Para exportar el modelo y poder utilizarlo en otros archivos

const Producto = mongoose.model("Producto", productoSchema);
module.exports = Producto;