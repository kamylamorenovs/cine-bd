import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import peliculasRouter from './routes/peliculas.routes.js';
import salasRouter from './routes/salas.routes.js';
import funcionesRouter from './routes/funciones.routes.js';
import reservacionesRouter from './routes/reservaciones.routes.js';
import ticketsRouter from './routes/tickets.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/peliculas', peliculasRouter);
app.use('/salas', salasRouter);
app.use('/funciones', funcionesRouter);
app.use('/reservaciones', reservacionesRouter);
app.use('/tickets', ticketsRouter);

app.use((req, res) => {
  res.status(404).json({ data: null, message: 'Ruta no encontrada' });
});

// Errores inesperados (por ejemplo, un JSON mal escrito)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ data: null, message: err.message });
});

export default app;
