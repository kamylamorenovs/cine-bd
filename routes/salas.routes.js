import { Router } from 'express';
import SalaController from '../controllers/sala.controller.js';

const router = Router();

router.get('/all', async (req, res) => {
  const response = await SalaController.listar();
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/:id', async (req, res) => {
  const response = await SalaController.ver(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.post('/create', async (req, res) => {
  const response = await SalaController.agregar(req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.put('/:id', async (req, res) => {
  const response = await SalaController.editar(req.params.id, req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.delete('/:id', async (req, res) => {
  const response = await SalaController.eliminar(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

export default router;
