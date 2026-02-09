const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;

const router = express.Router();
const SECRET_KEY = 'clave_secreta_simple';

async function leerArchivo(nombre) {
  const data = await fs.readFile(nombre, 'utf8');
  return JSON.parse(data);
}

async function escribirArchivo(nombre, data) {
  await fs.writeFile(nombre, JSON.stringify(data, null, 2));
}

router.post('/register', async (req, res, next) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    const usuarios = await leerArchivo('usuarios.json');
    const hash = await bcrypt.hash(password, 10);

    usuarios.push({ usuario, password: hash });
    await escribirArchivo('usuarios.json', usuarios);

    res.json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { usuario, password } = req.body;
    const usuarios = await leerArchivo('usuarios.json');

    const user = usuarios.find(u => u.usuario === usuario);
    if (!user) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ usuario }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
