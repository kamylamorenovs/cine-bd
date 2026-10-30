import ReservacionModel from '../models/reservacion.model.js';
import FuncionModel from '../models/funcion.model.js';

// Controlador de reservaciones: valida los datos y devuelve { status, data, message }.
// No usa req ni res, y todos sus métodos son asíncronos (devuelven Promesas).
class ReservacionController {
  // Revisa que los datos enviados tengan el formato correcto
  validarFormato(datos) {
    if (datos.cantidad !== undefined && datos.cantidad !== null && (datos.cantidad === '' || Number.isNaN(Number(datos.cantidad)))) {
      return 'cantidad debe ser un número';
    }
    return null;
  }

  // Revisa que los datos relacionados existan en la base de datos
  async revisarRelaciones(datos) {
    if (datos.funcionId !== undefined && datos.funcionId !== null && !(await FuncionModel.buscarPorId(datos.funcionId))) {
      return 'La función indicada no existe';
    }
    return null;
  }

  async listar() {
    const data = await ReservacionModel.listar();
    return { status: 200, data, message: 'Lista de reservaciones' };
  }

  async ver(id) {
    const data = await ReservacionModel.buscarPorId(id);
    if (!data) {
      return { status: 404, data: null, message: `No se encontró la reservación con id ${id}` };
    }
    return { status: 200, data, message: 'Reservación encontrada' };
  }

  async agregar(datos = {}) {
    const requeridos = ['funcionId', 'cliente', 'cantidad'];
    const faltan = requeridos.filter((c) => datos[c] === undefined || datos[c] === null || datos[c] === '');
    if (faltan.length > 0) {
      return { status: 400, data: null, message: `Faltan datos: ${faltan.join(', ')}` };
    }
    const error = this.validarFormato(datos) || (await this.revisarRelaciones(datos));
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await ReservacionModel.crear(datos);
    return { status: 201, data, message: 'Reservación creada correctamente' };
  }

  async editar(id, datos = {}) {
    const actual = await ReservacionModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró la reservación con id ${id}` };
    }
    const vacios = ['funcionId', 'cliente', 'cantidad'].filter((c) => datos[c] === '' || datos[c] === null);
    if (vacios.length > 0) {
      return { status: 400, data: null, message: `Estos campos no pueden estar vacíos: ${vacios.join(', ')}` };
    }
    const error = this.validarFormato(datos) || (await this.revisarRelaciones(datos));
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await ReservacionModel.actualizar(id, datos);
    return { status: 200, data, message: 'Reservación actualizada correctamente' };
  }

  async eliminar(id) {
    const actual = await ReservacionModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró la reservación con id ${id}` };
    }
    try {
      await ReservacionModel.eliminar(id);
    } catch (error) {
      // La base de datos no deja eliminar algo que otro registro está usando
      return { status: 400, data: null, message: 'No se puede eliminar porque tiene elementos relacionados' };
    }
    return { status: 200, data: actual, message: 'Reservación eliminada correctamente' };
  }

  async listarDetalle() {
    const data = await ReservacionModel.listarDetalle();
    return { status: 200, data, message: 'Reservaciones con su función y sus tickets' };
  }

  async ticketsDe(id) {
    const reservacion = await ReservacionModel.buscarPorId(id);
    if (!reservacion) {
      return { status: 404, data: null, message: `No se encontró la reservación con id ${id}` };
    }
    const data = await ReservacionModel.ticketsDe(id);
    return { status: 200, data, message: `Tickets de la reservación ${id}` };
  }
}

export default new ReservacionController();
