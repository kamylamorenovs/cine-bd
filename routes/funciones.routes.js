import { Router } from 'express';
import FuncionController from '../controllers/funcion.controller.js';

const router = Router();

router.get('/all', async (req, res) => {
  const response = await FuncionController.listar();
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/rango', async (req, res) => {
  const response = await FuncionController.rango(req.query.desde, req.query.hasta);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/:id/detalle', async (req, res) => {
  const response = await FuncionController.detalle(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.get('/:id', async (req, res) => {
  const response = await FuncionController.ver(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.post('/create', async (req, res) => {
  const response = await FuncionController.agregar(req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.put('/:id', async (req, res) => {
  const response = await FuncionController.editar(req.params.id, req.body);
  res.status(response.status).json({ data: response.data, message: response.message });
});

router.delete('/:id', async (req, res) => {
  const response = await FuncionController.eliminar(req.params.id);
  res.status(response.status).json({ data: response.data, message: response.message });
});

export default router;
