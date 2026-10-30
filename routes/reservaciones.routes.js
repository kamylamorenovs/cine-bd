import { Router } from 'express';
import ReservacionController from '../controllers/reservacion.controller.js';

const router = Router();

router.get('/all', async (req, res) => {
  const response = await ReservacionController.listar();
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/:id/tickets', async (req, res) => {
  const response = await ReservacionController.ticketsDe(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/:id', async (req, res) => {
  const response = await ReservacionController.ver(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.post('/create', async (req, res) => {
  const response = await ReservacionController.agregar(req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.put('/:id', async (req, res) => {
  const response = await ReservacionController.editar(req.params.id, req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.delete('/:id', async (req, res) => {
  const response = await ReservacionController.eliminar(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

export default router;
