const express = require('express');
const fs = require('fs').promises;
const verificarToken = require('./middleware');

const router = express.Router();

async function leerArchivo(nombre) {
  const data = await fs.readFile(nombre, 'utf8');
  return JSON.parse(data);
}

async function escribirArchivo(nombre, data) {
  await fs.writeFile(nombre, JSON.stringify(data, null, 2));
}

router.get('/tareas', verificarToken, async (req, res, next) => {
  try {
    const tareas = await leerArchivo('tareas.json');
    res.json(tareas);
  } catch (error) {
    next(error);
  }
});

router.post('/tareas', verificarToken, async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    const tareas = await leerArchivo('tareas.json');
    const nuevaTarea = {
      id: Date.now(),
      titulo,
      descripcion
    };

    tareas.push(nuevaTarea);
    await escribirArchivo('tareas.json', tareas);

    res.json({ mensaje: 'Tarea agregada', tarea: nuevaTarea });
  } catch (error) {
    next(error);
  }
});

router.put('/tareas/:id', verificarToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    const tareas = await leerArchivo('tareas.json');
    const tarea = tareas.find(t => t.id == id);

    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    tarea.titulo = titulo || tarea.titulo;
    tarea.descripcion = descripcion || tarea.descripcion;

    await escribirArchivo('tareas.json', tareas);
    res.json({ mensaje: 'Tarea actualizada' });
  } catch (error) {
    next(error);
  }
});

router.delete('/tareas/:id', verificarToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    let tareas = await leerArchivo('tareas.json');

    tareas = tareas.filter(t => t.id != id);
    await escribirArchivo('tareas.json', tareas);

    res.json({ mensaje: 'Tarea eliminada' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
