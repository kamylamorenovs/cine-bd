import TicketModel from '../models/ticket.model.js';
import ReservacionModel from '../models/reservacion.model.js';

// Controlador de tickets: valida los datos y devuelve { status, data, message }.
// No usa req ni res, y todos sus métodos son asíncronos (devuelven Promesas).
class TicketController {
  // Revisa que los datos enviados tengan el formato correcto
  validarFormato(datos) {
    if (datos.precio !== undefined && datos.precio !== null && (datos.precio === '' || Number.isNaN(Number(datos.precio)))) {
      return 'precio debe ser un número';
    }
    return null;
  }

  // Revisa que los datos relacionados existan en la base de datos
  async revisarRelaciones(datos) {
    if (datos.reservacionId !== undefined && datos.reservacionId !== null && !(await ReservacionModel.buscarPorId(datos.reservacionId))) {
      return 'La reservación indicada no existe';
    }
    return null;
  }

  async listar() {
    const data = await TicketModel.listar();
    return { status: 200, data, message: 'Lista de tickets' };
  }

  async ver(id) {
    const data = await TicketModel.buscarPorId(id);
    if (!data) {
      return { status: 404, data: null, message: `No se encontró el ticket con id ${id}` };
    }
    return { status: 200, data, message: 'Ticket encontrado' };
  }

  async agregar(datos = {}) {
    const requeridos = ['reservacionId', 'asiento', 'precio'];
    const faltan = requeridos.filter((c) => datos[c] === undefined || datos[c] === null || datos[c] === '');
    if (faltan.length > 0) {
      return { status: 400, data: null, message: `Faltan datos: ${faltan.join(', ')}` };
    }
    const error = this.validarFormato(datos) || (await this.revisarRelaciones(datos));
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await TicketModel.crear(datos);
    return { status: 201, data, message: 'Ticket creado correctamente' };
  }

  async editar(id, datos = {}) {
    const actual = await TicketModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró el ticket con id ${id}` };
    }
    const vacios = ['asiento', 'precio'].filter((c) => datos[c] === '' || datos[c] === null);
    if (vacios.length > 0) {
      return { status: 400, data: null, message: `Estos campos no pueden estar vacíos: ${vacios.join(', ')}` };
    }
    const error = this.validarFormato(datos) || (await this.revisarRelaciones(datos));
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await TicketModel.actualizar(id, datos);
    return { status: 200, data, message: 'Ticket actualizado correctamente' };
  }

  async eliminar(id) {
    const actual = await TicketModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró el ticket con id ${id}` };
    }
    try {
      await TicketModel.eliminar(id);
    } catch (error) {
      // La base de datos no deja eliminar algo que otro registro está usando
      return { status: 400, data: null, message: 'No se puede eliminar porque tiene elementos relacionados' };
    }
    return { status: 200, data: actual, message: 'Ticket eliminado correctamente' };
  }

  async quitarReservacion(id) {
    const actual = await TicketModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró el ticket con id ${id}` };
    }
    const data = await TicketModel.quitarReservacion(id);
    return { status: 200, data, message: 'Relación con la reservación eliminada' };
  }
}

export default new TicketController();
