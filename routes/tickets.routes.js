import { Router } from 'express';
import TicketController from '../controllers/ticket.controller.js';

const router = Router();

router.get('/all', async (req, res) => {
  const response = await TicketController.listar();
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/:id', async (req, res) => {
  const response = await TicketController.ver(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.post('/create', async (req, res) => {
  const response = await TicketController.agregar(req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.put('/:id', async (req, res) => {
  const response = await TicketController.editar(req.params.id, req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.delete('/:id/reservacion', async (req, res) => {
  const response = await TicketController.quitarReservacion(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.delete('/:id', async (req, res) => {
  const response = await TicketController.eliminar(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

export default router;
