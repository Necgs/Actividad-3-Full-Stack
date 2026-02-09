const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave_secreta_simple';

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
}

function manejarErrores(error, req, res, next) {
  console.error(error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
}

module.exports = verificarToken;
module.exports.manejarErrores = manejarErrores;
