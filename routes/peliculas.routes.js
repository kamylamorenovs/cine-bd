import { Router } from 'express';
import PeliculaController from '../controllers/pelicula.controller.js';

const router = Router();

router.get('/all', async (req, res) => {
  const response = await PeliculaController.listar();
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/ultimas', async (req, res) => {
  const response = await PeliculaController.ultimas();
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/:id', async (req, res) => {
  const response = await PeliculaController.ver(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.post('/create', async (req, res) => {
  const response = await PeliculaController.agregar(req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.put('/:id', async (req, res) => {
  const response = await PeliculaController.editar(req.params.id, req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.delete('/:id', async (req, res) => {
  const response = await PeliculaController.eliminar(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

export default router;
