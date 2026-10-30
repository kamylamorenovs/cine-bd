import { Router } from 'express';
import PeliculaController from '../controllers/pelicula.controller.js';
import SalaController from '../controllers/sala.controller.js';
import FuncionController from '../controllers/funcion.controller.js';
import ReservacionController from '../controllers/reservacion.controller.js';
import TicketController from '../controllers/ticket.controller.js';

const router = Router();

// Después de crear, editar o eliminar se vuelve a la lista con un aviso
const volver = (res, ruta, mensaje, tipo = 'ok') => {
  res.redirect(`${ruta}?mensaje=${encodeURIComponent(mensaje)}&tipo=${tipo}`);
};

router.get('/', async (req, res) => {
  const totales = {
    peliculas: (await PeliculaController.listar()).data.length,
    salas: (await SalaController.listar()).data.length,
    funciones: (await FuncionController.listar()).data.length,
    reservaciones: (await ReservacionController.listar()).data.length,
    tickets: (await TicketController.listar()).data.length,
  };
  res.render('index', { titulo: 'Cine', totales });
});

// ----- Películas: crear, ver, editar y eliminar -----
router.get('/vistas/peliculas', async (req, res) => {
  const response = await PeliculaController.listar();
  res.render('peliculas', { titulo: 'Películas', peliculas: response.data, mensaje: req.query.mensaje || null, tipo: req.query.tipo || 'ok' });
});

router.get('/vistas/peliculas/nueva', (req, res) => {
  res.render('pelicula-form', { titulo: 'Nueva película', pelicula: null, error: null });
});

router.post('/vistas/peliculas', async (req, res) => {
  const response = await PeliculaController.agregar(req.body);
  if (response.status !== 201) {
    return res.status(response.status).render('pelicula-form', { titulo: 'Nueva película', pelicula: req.body, error: response.message });
  }
  volver(res, '/vistas/peliculas', 'Película creada correctamente');
});

router.get('/vistas/peliculas/:id/editar', async (req, res) => {
  const response = await PeliculaController.ver(req.params.id);
  if (response.status !== 200) {
    return volver(res, '/vistas/peliculas', response.message, 'error');
  }
  res.render('pelicula-form', { titulo: 'Editar película', pelicula: response.data, error: null });
});

router.post('/vistas/peliculas/:id/editar', async (req, res) => {
  const response = await PeliculaController.editar(req.params.id, req.body);
  if (response.status !== 200) {
    return res.status(response.status).render('pelicula-form', { titulo: 'Editar película', pelicula: { ...req.body, id: req.params.id }, error: response.message });
  }
  volver(res, '/vistas/peliculas', 'Película actualizada correctamente');
});

router.post('/vistas/peliculas/:id/eliminar', async (req, res) => {
  const response = await PeliculaController.eliminar(req.params.id);
  if (response.status !== 200) {
    return volver(res, '/vistas/peliculas', response.message, 'error');
  }
  volver(res, '/vistas/peliculas', 'Película eliminada correctamente');
});

// ----- Salas: crear, ver, editar y eliminar -----
router.get('/vistas/salas', async (req, res) => {
  const response = await SalaController.listar();
  res.render('salas', { titulo: 'Salas', salas: response.data, mensaje: req.query.mensaje || null, tipo: req.query.tipo || 'ok' });
});

router.get('/vistas/salas/nueva', (req, res) => {
  res.render('sala-form', { titulo: 'Nueva sala', sala: null, error: null });
});

router.post('/vistas/salas', async (req, res) => {
  const response = await SalaController.agregar(req.body);
  if (response.status !== 201) {
    return res.status(response.status).render('sala-form', { titulo: 'Nueva sala', sala: req.body, error: response.message });
  }
  volver(res, '/vistas/salas', 'Sala creada correctamente');
});

router.get('/vistas/salas/:id/editar', async (req, res) => {
  const response = await SalaController.ver(req.params.id);
  if (response.status !== 200) {
    return volver(res, '/vistas/salas', response.message, 'error');
  }
  res.render('sala-form', { titulo: 'Editar sala', sala: response.data, error: null });
});

router.post('/vistas/salas/:id/editar', async (req, res) => {
  const response = await SalaController.editar(req.params.id, req.body);
  if (response.status !== 200) {
    return res.status(response.status).render('sala-form', { titulo: 'Editar sala', sala: { ...req.body, id: req.params.id }, error: response.message });
  }
  volver(res, '/vistas/salas', 'Sala actualizada correctamente');
});

router.post('/vistas/salas/:id/eliminar', async (req, res) => {
  const response = await SalaController.eliminar(req.params.id);
  if (response.status !== 200) {
    return volver(res, '/vistas/salas', response.message, 'error');
  }
  volver(res, '/vistas/salas', 'Sala eliminada correctamente');
});

// ----- Funciones y reservaciones: vistas de consulta -----
router.get('/vistas/funciones', async (req, res) => {
  const response = await FuncionController.listarDetalle();
  res.render('funciones', { titulo: 'Funciones', funciones: response.data });
});

router.get('/vistas/reservaciones', async (req, res) => {
  const response = await ReservacionController.listarDetalle();
  res.render('reservaciones', { titulo: 'Reservaciones', reservaciones: response.data });
});

export default router;
