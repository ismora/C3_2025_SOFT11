const express = require("express"); 
const router = express.Router(); // Crear la señal 
const Usuario = require("../models/usuario.model");

// Rutas

// POST: Crear - enviar datos a la base de datos 
router.post("/", async(req, res) => {
    const {correo, nombre, cedula, celular, contrasenia} = req.body;

    // Validar que existan los datos que son obligatorios 
    if (!correo || !nombre || !cedula || !celular || !contrasenia){
        return res.status(400).json({mensaje: "Todos los campos son obligatorios"});
    }
    // Crear el nuevo usuario en la base de datos
    try {
        const nuevoUsuario = new Usuario({correo, nombre, cedula, celular, contrasenia});
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario); // 201: El recurso se creó correctamente
    } catch(error){
        res.status(400).json({mensajeError: error.message});
    }
});

// GET: Obtener los datos de todos los usuarios
router.get("/", async(req, res) => {
    try{
        const usuarios = await Usuario.find();
        res.json(usuarios);
    }catch(error){
        res.status(400).json({mensajeError: error.message});
    }
});

// GET: Obtener el usuario con el número de cédula definido
router.get("/buscar-por-cedula", async(req, res) => {
    const {cedula} = req.body;

    if(!cedula){
        return res.status(400).json({mensajeError: "El campo 'cédula' es obligatorio"});
    }

    try{
        const usuario = await Usuario.findOne({cedula});
        if (!usuario){
            return res.status(404).json({mensajeError: "No se encontro el usuario con la cédula proporcionada"});
        }
        res.json(usuario);
    } catch{
        res.status(500).json({mensajeError: "Error en el servidor al buscar usuario", error: error.message}); 
    }
});

// DELETE: Eliminar un usuario por cédula 
router.delete("/eliminar-por-cedula", async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({msj: "El campo 'cedula' es obligatorio en el cuerpo de la solicitud"});
    }
    
    try {
        const resultado = await Usuario.deleteOne({ cedula });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({msj: "No se encontró usuario con la cédula proporcionada"});
        }
        res.json({ 
            msj: "Usuario eliminado correctamente",
            cedula: cedula,
            registrosEliminados: resultado.deletedCount
        });
    } catch (error) {
        res.status(500).json({msj: "Error en el servidor al eliminar usuario", 
            error: error.message});
    }
});

// Exportar la ruta
module.exports = router;