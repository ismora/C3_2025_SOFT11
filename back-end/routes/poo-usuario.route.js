const express = require("express");
const Usuario = require("../models/usuario.model");
const Certificacion = require("../models/certificacion.model");

class UsuarioController {
    constructor() {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.post("/", this.crearUsuario);
        this.router.get("/", this.obtenerUsuarios);
        this.router.get("/buscar-por-cedula", this.buscarPorCedula);
        this.router.put("/agregar-certificacion", this.agregarCertificacion);
        this.router.put("/actualizar-contrasenia", this.actualizarContrasenia);
        this.router.get("/certificaciones", this.obtenerUsuariosPorCertificacion);
        this.router.delete("/eliminar-por-cedula", this.eliminarPorCedula);
    }

    crearUsuario = async (req, res) => {
        const { correo, cedula, nombre, contrasenia } = req.body;

        if (!correo || !cedula || !nombre || !contrasenia) {
            return res.status(400).json({ msj: "Todos los campos son obligatorios" });
        }
        
        try {
            const nuevoUsuario = new Usuario({ correo, cedula, nombre, contrasenia });
            await nuevoUsuario.save();
            res.status(201).json(nuevoUsuario);
        } catch (error) {
            res.status(400).json({ msj: error.message });
        }
    }

    obtenerUsuarios = async (req, res) => {
        try {
            const usuarios = await Usuario.find().populate("certificaciones");
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ msj: error.message });
        }
    }

    buscarPorCedula = async (req, res) => {
        try {
            const { cedula } = req.body;
            
            if (!cedula) {
                return res.status(400).json({ msj: "El campo 'cédula' es obligatorio" });
            }

            const usuario = await Usuario.findOne({ cedula }).populate("certificaciones");
            
            if (!usuario) {
                return res.status(404).json({ 
                    msj: "No se encontró usuario con la cédula proporcionada" 
                });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({
                msj: "Error en el servidor al buscar usuario", 
                error: error.message
            });
        }
    }

    agregarCertificacion = async (req, res) => {
        const { cedula, certificacionId } = req.body;

        if (!cedula || !certificacionId) {
            return res.status(400).json({ 
                msj: "Cédula y ID de certificación son obligatorios" 
            });
        }
        
        try {
            const certificacion = await Certificacion.findById(certificacionId);
            if (!certificacion) {
                return res.status(404).json({ msj: "Certificación no encontrada" });
            }

            const usuario = await Usuario.findOne({ cedula });
            if (!usuario) {
                return res.status(404).json({ msj: "Usuario no encontrado" });
            }
            
            if (!usuario.certificaciones.includes(certificacionId)) {
                usuario.certificaciones.push(certificacionId);
                await usuario.save();
            }
            
            res.status(200).json({ 
                msj: "Certificación agregada al usuario", 
                usuario 
            });
        } catch (error) {
            res.status(500).json({ 
                msj: "Error al agregar la certificación", 
                error: error.message 
            });
        }
    }

    actualizarContrasenia = async (req, res) => {
        try {
            const { cedula, nuevaContrasenia } = req.body;

            if (!cedula || !nuevaContrasenia) {
                return res.status(400).json({ 
                    msj: "Los campos 'cedula' y 'nuevaContrasenia' son obligatorios" 
                });
            }

            const usuario = await Usuario.findOneAndUpdate(
                { cedula },
                { contrasenia: nuevaContrasenia },
                { new: true, runValidators: true }
            );

            if (!usuario) {
                return res.status(404).json({ 
                    msj: "No se encontró usuario con la cédula proporcionada" 
                });
            }

            res.json({ 
                msj: "Contraseña actualizada correctamente",
                usuario: {
                    cedula: usuario.cedula,
                    nombre: usuario.nombre,
                    correo: usuario.correo
                }
            });
        } catch (error) {
            res.status(500).json({ 
                msj: "Error al actualizar la contraseña", 
                error: error.message 
            });
        }
    }

    obtenerUsuariosPorCertificacion = async (req, res) => {
        try {
            const { certificacionId } = req.body;
            
            if (!certificacionId) {
                return res.status(400).json({
                    msj: "El campo 'certificacionId' es obligatorio en el cuerpo de la solicitud"
                });
            }

            const usuarios = await Usuario.find({ certificaciones: certificacionId })
                                         .select("-contrasenia");

            if (usuarios.length === 0) {
                return res.status(404).json({
                    msj: "No se encontraron usuarios con esta certificación"
                });
            }

            res.json(usuarios);
        } catch (error) {
            res.status(500).json({
                msj: "Error al obtener usuarios", 
                error: error.message
            });
        }
    }

    eliminarPorCedula = async (req, res) => {
        try {
            const { cedula } = req.body;

            if (!cedula) {
                return res.status(400).json({
                    msj: "El campo 'cedula' es obligatorio en el cuerpo de la solicitud"
                });
            }

            const resultado = await Usuario.deleteOne({ cedula });

            if (resultado.deletedCount === 0) {
                return res.status(404).json({
                    msj: "No se encontró usuario con la cédula proporcionada"
                });
            }

            res.json({ 
                msj: "Usuario eliminado correctamente",
                cedula: cedula,
                registrosEliminados: resultado.deletedCount
            });
        } catch (error) {
            res.status(500).json({ 
                msj: "Error en el servidor al eliminar usuario", 
                error: error.message
            });
        }
    }
}

module.exports = new UsuarioController().router;