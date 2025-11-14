const express = require("express");
const router = express.Router(); // Crear la señal 
const Usuario = require("../models/usuario.model");
const Certificacion = require("../models/certificacion.model");
const bcrypt = require('bcryptjs');

// Rutas
// POST: Crear - enviar datos a la base de datos 
router.post("/", async (req, res) => {
    const { correo, nombre, cedula, celular, contrasenia } = req.body;

    // Validar que existan los datos que son obligatorios 
    if (!correo || !nombre || !cedula || !celular || !contrasenia) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    // Crear el nuevo usuario en la base de datos
    try {
        const nuevoUsuario = new Usuario({ correo, nombre, cedula, celular, contrasenia });
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario); // 201: El recurso se creó correctamente
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

/* 
POST: Validar credenciales  
GET: Utilizado para solicitar recursos, sin embargo, no es seguro para enviar credenciales porque GET las expone en logs del servidor, historial del navegador, URLs referentes y cache del navegadorcredenciales. Ademá, muchos servidores, proxies y herramientas ignoran el body en GET.

POST: Se utiliza para crear un recurso o para enviar datos que no encajan en los otros métodos. Es el método más común para enviar datos sensibles.
*/
router.post("/validar-credenciales", async (req, res) => {
    const { cedulaOcorreo, contrasenia } = req.body;

    // Validar los datos obligatorios
    if (!cedulaOcorreo || !contrasenia) {
        return res.status(400).json({ mensaje: "El campo 'cedulaOcorreo' y 'contrasenia' son obligatorios" });
    }

    try {
        // Buscar usuario por cédula o correo
        const usuario = await Usuario.findOne({
            $or: [
                { cedula: cedulaOcorreo },
                { correo: cedulaOcorreo }
            ]
        }).populate("certificaciones");

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado con la cédula o correo proporcionado" });
        }

        // Comparar contraseñas (inseguro y no recomendado) 
        const esContraseniaValida = (contrasenia === usuario.contrasenia);

        if (!esContraseniaValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // Si las credenciales son válidas, retornar datos del usuario (sin contraseña)
        const usuarioResponse = {
            id: usuario._id,
            correo: usuario.correo,
            nombre: usuario.nombre,
            cedula: usuario.cedula,
            celular: usuario.celular,
            certificaciones: usuario.certificaciones
        };

        res.status(200).json({ success: true, mensaje: "Credenciales válidas", usuario: usuarioResponse });

    } catch (error) {
        res.status(500).json({ success: false, mensaje: "Error en el servidor al validar credenciales", error: error.message });
    }
});
/*
http://localhost:3000/usuarios/validar-credenciales
{
  "cedulaOcorreo": "vmora@test.ac.cr", 
  "contrasenia": "1"
}
*/

// POST: Crear un nuevo usuario con la contraseña encriptada para mayor seguridad
router.post("/contrasenia-segura", async (req, res) => {
    const { correo, nombre, cedula, celular, contrasenia } = req.body;

    // Validar que existan los datos que son obligatorios 
    if (!correo || !nombre || !cedula || !celular || !contrasenia) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        const saltRounds = 10; // Número de rondas de hashing (costo computacional)
        const hashedPassword = await bcrypt.hash(contrasenia, saltRounds); // Aplica algoritmo de hashing múltiples veces
        /* Ejemplo
        Contraseña original: "miPassword123"
        Hash resultante: "$2b$10$s8S5Gf2xOcHj9kLmNqRvT.uVwXyZ1A2B3C4D5E6F7G8H9I0J1K2L3M4"
        */

        const nuevoUsuario = new Usuario({ correo, nombre, cedula, celular, contrasenia: hashedPassword });
        await nuevoUsuario.save();

        // No retornar la contraseña en la respuesta
        const usuarioResponse = {
            id: nuevoUsuario._id,
            correo: nuevoUsuario.correo,
            nombre: nuevoUsuario.nombre,
            cedula: nuevoUsuario.cedula,
            celular: nuevoUsuario.celular,
            certificaciones: nuevoUsuario.certificaciones
        };

        res.status(201).json({ success: true, mensaje: "Usuario creado exitosamente", usuario: usuarioResponse });
    } catch (error) {
        res.status(400).json({ success: false, mensajeError: error.message });
    }
});
/*
Instalar la dependencia: npm install bcryptjs
http://localhost:3000/usuarios/contrasenia-segura
{
  "correo": "marta@test.ac.cr", 
  "nombre": "Marta", 
  "cedula": "147", 
  "celular": "147", 
  "contrasenia": "147" 
}
*/

//POST: Validar usuario y contraseña encriptada
router.post("/login-encriptado", async (req, res) => {
    const { correo, contrasenia } = req.body;

    // Validar que existan los datos obligatorios
    if (!correo || !contrasenia) {
        return res.status(400).json({ success: false, mensaje: "El correo y la contraseña son obligatorios" });
    }

    try {
        // Buscar usuario por correo
        const usuario = await Usuario.findOne({ correo }).populate("certificaciones");

        if (!usuario) {
            return res.status(404).json({ success: false, mensaje: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const esContraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);

        if (!esContraseniaValida) {
            return res.status(401).json({ success: false, mensaje: "Contraseña incorrecta" });
        }

        // Si las credenciales son válidas, retornar datos del usuario (sin contraseña)
        const usuarioResponse = {
            id: usuario._id,
            correo: usuario.correo,
            nombre: usuario.nombre,
            cedula: usuario.cedula,
            celular: usuario.celular,
            certificaciones: usuario.certificaciones
        };

        res.status(200).json({ success: true, mensaje: "Inicio de sesión exitoso", usuario: usuarioResponse });

    } catch (error) {
        res.status(500).json({ success: false, mensaje: "Error en el servidor al validar credenciales", error: error.message });
    }
});
/*
http://localhost:3000/usuarios/login-encriptado
{
  "correo": "marta@test.ac.cr", 
  "contrasenia": "147"
}
*/


// GET: Obtener los datos de todos los usuarios
router.get("/", async (req, res) => {
    try {
        const usuarios = await Usuario.find().populate("certificaciones");
        res.json(usuarios);
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

// GET: Obtener el usuario con el número de cédula definido
router.get("/buscar-por-cedula", async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({ mensajeError: "El campo 'cédula' es obligatorio" });
    }

    try {
        const usuario = await Usuario.findOne({ cedula });
        if (!usuario) {
            return res.status(404).json({ mensajeError: "No se encontro el usuario con la cédula proporcionada" });
        }
        res.json(usuario);
    } catch {
        res.status(500).json({ mensajeError: "Error en el servidor al buscar usuario", error: error.message });
    }
});

// GET: Obtener estadísticas generales de usuarios 
router.get("/estadisticas-generales", async (req, res) => {
    try {
        const totalUsuarios = await Usuario.countDocuments();
        const usuariosConCertificaciones = await Usuario.countDocuments({ 
            certificaciones: { $exists: true, $not: { $size: 0 } } 
        });
        const usuariosSinCertificaciones = totalUsuarios - usuariosConCertificaciones;

        res.json({
            totalUsuarios,
            usuariosConCertificaciones,
            usuariosSinCertificaciones,
            porcentajeConCertificaciones: totalUsuarios > 0 ? 
                Math.round((usuariosConCertificaciones / totalUsuarios) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ mensajeError: "Error en el servidor al obtener estadísticas generales", error: error.message });
    }
});

// GET: Obtener top usuarios con más certificaciones
router.get("/top-usuarios-certificaciones", async (req, res) => {
    const limite = 2;

    try {
        const topUsuarios = await Usuario.aggregate([
            {
                $project: {
                    nombre: 1,
                    correo: 1,
                    cedula: 1,
                    cantidadCertificaciones: { $size: { $ifNull: ["$certificaciones", []] } }
                }
            },
            {
                $sort: { cantidadCertificaciones: -1 }
            },
            {
                $limit: parseInt(limite)
            }
        ]);

        res.json(topUsuarios);
    } catch (error) {
        res.status(500).json({ mensajeError: "Error en el servidor al obtener top usuarios", error: error.message});
    }
});


// Endpoint PUT: Actualizar el usuario al asignar una certificación
router.put("/agregar-certificacion", async (req, res) => {
    const { cedula, certificacionId } = req.body;

    if (!cedula) {
        return res.status(400).json({ mensajeError: "El campo 'cédula' es obligatorio" });
    }
    if (!certificacionId) {
        return res.status(400).json({ mensajeError: "El campo 'id de la certificación' es obligatorio" });
    }
    try {
        // Verificar que la certificación existe
        const certificacion = await Certificacion.findById(certificacionId);
        if (!certificacion) {
            return res.status(404).json({ mensajeError: "Certificación no encontrada" });
        }

        // Buscar que el usuario existe 
        const usuario = await Usuario.findOne({ cedula });
        if (!usuario) {
            return res.status(404).json({ mensajeError: "Usuario no encontrado" });
        }

        // Agregar la certificación si no está repetida
        if (!usuario.certificaciones.includes(certificacionId)) {
            usuario.certificaciones.push(certificacionId);
            await usuario.save();
            res.status(200).json({ mensaje: "Certificación asociada al usuario" });
        }
        else {
            // 202 Accepted: El servidor procesó correctamente la petición, aunque no cambió nada.
            res.status(202).json({ mensaje: "Certificación no asociada al usuario ya que la certificación ya estaba asociada" });
        }
    } catch (error) {
        res.status(500).json({ mensajeError: "Error al agregar la certificación", error: error.message });
    }
});

// DELETE: Eliminar un usuario por cédula 
router.delete("/eliminar-por-cedula", async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({ msj: "El campo 'cedula' es obligatorio en el cuerpo de la solicitud" });
    }

    try {
        const resultado = await Usuario.deleteOne({ cedula });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ msj: "No se encontró usuario con la cédula proporcionada" });
        }
        res.json({
            msj: "Usuario eliminado correctamente", cedula: cedula, registrosEliminados: resultado.deletedCount
        });
    } catch (error) {
        res.status(500).json({ msj: "Error en el servidor al eliminar usuario", error: error.message });
    }
});

// Exportar la ruta
module.exports = router;