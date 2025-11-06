const express = require("express");
const router = express.Router(); //Crear la señal
const Producto = require("../models/producto.model"); //Importar el modelo

//Rutas para el CRUD de usuarios

//POST: Crear - enviar datos a la base de datos

router.post("/", async (req, res) => {
    const {codigo, nombreProducto, precio, marca, cantidadDisponible, enInventario} = req.body;
    if (!codigo || !nombreProducto || !precio || !marca || !cantidadDisponible || enInventario===undefined) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    //Crear un nuevo producto en la base de datos

    try {
        const nuevoProducto = new Producto({codigo, nombreProducto, precio, marca, cantidadDisponible, enInventario});
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto); //201: El recurso fue creado correctamente
    } catch (error) {
        res.status(400).json({mensajeError: error.message});
    }

});

//GET: Leer - obtener datos del servidor

router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(400).json({mensajeError: error.message});
    }
})

//Exportar la ruta

module.exports = router;