const express = require("express");
const router = express.Router();
const Certificacion = require("../models/certificacion.model");

// Endpoint POST: Crear, enviar datos al servidor (crear una nueva certificación)
router.post("/", async (req, res) => {
    // No se realizan validaciones aquí porque este endpoint se consume solo de manera interna. 
    // Si va a ser utilizado por otros servicios (como una API - Conjunto completo de reglas, especificaciones y herramientas que definen cómo deben interactuar dos aplicaciones, decir es el contrato completo de comunicación, en este caso CRUD para gestionar certificaciones-) debe tener validaciones.  
    try {
        const nuevaCertificacion = new Certificacion(req.body);
        const certificacionGuardada = await nuevaCertificacion.save();
        res.status(201).json(certificacionGuardada); // 201: El recurso se creó correctamente 
    } catch (error) {
        res.status(400).json({ msj: "Error al crear la certificación", error });
    }
});

/* {
"nombre": "Python",
"institucion": "CENFOTEC"
} */

// Endpoint GET: Obtener todas las certificaciones
router.get("/", async (req, res) => {
    try {
        const certificaciones = await Certificacion.find();
        res.json(certificaciones);
    } catch (error) {
        res.status(500).json({ msj: "Error al obtener las certificaciones", error });
    }
});

// Endpoint GET: Obtener una certificación por ID
router.get('/obtener-por-id', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ mensaje: 'El campo "id" es obligatorio' });
        }

        const certificacion = await Certificacion.findById(id);
        if (!certificacion) {
            return res.status(404).json({ mensaje: 'Certificación no encontrada' });
        }
        res.json(certificacion);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
/*
http://localhost:3000/certificaciones/obtener-por-id
{
  "id": "686f469f0bf135cc95b824d5"
}
  */

// Endpoint GET: Obtener certificaciones por institución 
router.get("/buscar-por-institucion", async (req, res) => {
    try {
        const { institucion } = req.body;

        if (!institucion) {
            return res.status(400).json({ msj: "El campo 'institución' es obligatorio" });
        }

        const certificaciones = await Certificacion.find({ institucion });

        if (certificaciones.length === 0) {
            return res.status(404).json({
                msj: "No se encontraron certificaciones para la institución proporcionada"
            });
        }

        res.json({
            cantidad: certificaciones.length,
            certificaciones: certificaciones
        });
    } catch (error) {
        res.status(500).json({
            msj: "Error en el servidor al buscar certificaciones por institución",
            error: error.message
        });
    }
});

/* 
http://localhost:3000/certificaciones/buscar-por-institucion
{
  "institucion": "Cenfotec"
}
*/

// Endpoint GET: Buscar certificaciones por nombre (coincidencia parcial)
router.get("/buscar-por-nombre", async (req, res) => {
    try {
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ msj: "El campo 'texto' es obligatorio para la búsqueda" });
        }

        // Busca certificaciones cuyo nombre contenga el texto (case insensitive)
        const certificaciones = await Certificacion.find({
            nombre: { $regex: texto, $options: 'i' }
            // $regex: Es el operador que dice "busca usando expresión regular" 'i': "case insensitive" (insensible a mayúsculas/minúsculas)
        });

        if (certificaciones.length === 0) {
            return res.status(404).json({
                msj: "No se encontraron certificaciones que contengan el texto en el nombre"
            });
        }

        res.json({
            cantidad: certificaciones.length,
            texto_buscado: texto,
            certificaciones: certificaciones
        });
    } catch (error) {
        res.status(500).json({
            msj: "Error en el servidor al buscar certificaciones por nombre",
            error: error.message
        });
    }
});

/*
http://localhost:3000/certificaciones/buscar-por-nombre
{
  "texto": "a"
}
*/

// Endpoint GET: Contar total de certificaciones registradas
router.get("/contar-certificaciones", async (req, res) => {
    try {
        const totalCertificaciones = await Certificacion.countDocuments();

        res.json({
            msj: "Conteo de certificaciones realizado correctamente",
            total: totalCertificaciones
        });
    } catch (error) {
        res.status(500).json({
            msj: "Error en el servidor al contar certificaciones",
            error: error.message
        });
    }
});
/*
http://localhost:3000/certificaciones/contar-certificaciones
*/

// Endpoint GET: Distribución de certificaciones por institución
router.get("/distribucion-instituciones", async (req, res) => {
    try {
        const distribucion = await Certificacion.aggregate([
            {
                $group: {
                    _id: "$institucion",
                    cantidad: { $sum: 1 },
                    porcentaje: {
                        $avg: {
                            $multiply: [100, 1]
                        }
                    }
                }
            },
            {
                $project: {
                    institucion: "$_id",
                    cantidad: 1,
                    porcentaje: {
                        $round: ["$porcentaje", 2]
                    },
                    _id: 0
                }
            },
            { $sort: { cantidad: -1 } }
        ]);

        // Calcular porcentajes reales
        const total = await Certificacion.countDocuments();
        const distribucionConPorcentaje = distribucion.map(item => ({
            ...item,
            porcentaje: ((item.cantidad / total) * 100).toFixed(2)
        }));

        res.json({
            msj: "Distribución de certificaciones por institución",
            total_certificaciones: total,
            distribucion: distribucionConPorcentaje
        });
    } catch (error) {
        res.status(500).json({
            msj: "Error en el servidor al obtener distribución",
            error: error.message
        });
    }
});
/*
http://localhost:3000/certificaciones/distribucion-instituciones
*/

// Endpoint GET: Top instituciones con más certificaciones
router.get("/top-instituciones", async (req, res) => {
    try {
        const { limite = 5 } = req.query; // Límite opcional, por defecto 5

        const topInstituciones = await Certificacion.aggregate([
            {
                $group: {
                    _id: "$institucion",
                    cantidad: { $sum: 1 }
                }
            },
            { $sort: { cantidad: -1 } },
            { $limit: parseInt(limite) },
            {
                $project: {
                    institucion: "$_id",
                    cantidad: 1,
                    _id: 0
                }
            }
        ]);

        res.json({
            msj: `Top ${limite} instituciones con más certificaciones`,
            top_instituciones: topInstituciones
        });
    } catch (error) {
        res.status(500).json({
            msj: "Error en el servidor al obtener top instituciones",
            error: error.message
        });
    }
});
/*
http://localhost:3000/certificaciones/top-instituciones
*/

// Endpoint PUT: Actualiza una certificación existente
router.put('/', async (req, res) => {
    try {
        const { id, ...datosActualizacion } = req.body;

        if (!id) {
            return res.status(400).json({ mensaje: 'El campo "id" es obligatorio' });
        }

        const certificacion = await Certificacion.findByIdAndUpdate(
            id,
            datosActualizacion,
            { new: true } // Devuelve el documento actualizado
        );
        if (!certificacion) {
            return res.status(404).json({ mensaje: 'Certificación no encontrada' });
        }
        res.json(certificacion);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

/*
http://localhost:3000/certificaciones/
{
  "id": "686f469f0bf135cc95b824d5",
  "nombre": "Python 3"
}

{
  "id": "686f469f0bf135cc95b824d5",
  "nombre": "Python 3", 
  "institucion": "Tec"
}
*/

// Endpoint PUT: Actualizar solo la institución de una certificación
router.put("/actualizar-institucion", async (req, res) => {
    try {
        const { id, institucion } = req.body;

        if (!id) {
            return res.status(400).json({ msj: "El campo 'id' es obligatorio" });
        }
        if (!institucion) {
            return res.status(400).json({ msj: "El campo 'institución' es obligatorio" });
        }

        const certificacionActualizada = await Certificacion.findByIdAndUpdate(
            id,
            { institucion },
            { new: true } // Devuelve el documento actualizado
        );

        if (!certificacionActualizada) {
            return res.status(404).json({
                msj: "No se encontró la certificación con el ID proporcionado"
            });
        }

        res.json({
            msj: "Institución actualizada correctamente",
            certificacion: certificacionActualizada
        });
    } catch (error) {
        res.status(500).json({
            msj: "Error en el servidor al actualizar la institución",
            error: error.message
        });
    }
});
/*
http://localhost:3000/certificaciones/actualizar-institucion
{
  "id": "686f469f0bf135cc95b824d5",
  "institucion": "Cenfotec"
}
*/

// Endpoint DELETE: Eliminar una certificación
router.delete('/', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ mensaje: 'El campo "id" es obligatorio' });
        }

        const certificacion = await Certificacion.findByIdAndDelete(id);

        if (!certificacion) {
            return res.status(404).json({ mensaje: 'Certificación no encontrada' });
        }

        res.json({ mensaje: 'Certificación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
/*
http://localhost:3000/certificaciones
{
  "id": "686f469f0bf135cc95b824d5"
}
*/

module.exports = router;