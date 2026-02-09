const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./auth');
const tareasRoutes = require('./tareas');
const { manejarErrores } = require('./middleware');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(authRoutes);
app.use(tareasRoutes);

app.use(manejarErrores);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
