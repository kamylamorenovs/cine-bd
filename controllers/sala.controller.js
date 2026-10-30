import SalaModel from '../models/sala.model.js';

// Controlador de salas: valida los datos y devuelve { status, data, message }.
// No usa req ni res, y todos sus métodos son asíncronos (devuelven Promesas).
class SalaController {
  // Revisa que los datos enviados tengan el formato correcto
  validarFormato(datos) {
    if (datos.capacidad !== undefined && datos.capacidad !== null && (datos.capacidad === '' || Number.isNaN(Number(datos.capacidad)))) {
      return 'capacidad debe ser un número';
    }
    return null;
  }

  async listar() {
    const data = await SalaModel.listar();
    return { status: 200, data, message: 'Lista de salas' };
  }

  async ver(id) {
    const data = await SalaModel.buscarPorId(id);
    if (!data) {
      return { status: 404, data: null, message: `No se encontró la sala con id ${id}` };
    }
    return { status: 200, data, message: 'Sala encontrada' };
  }

  async agregar(datos = {}) {
    const requeridos = ['nombre', 'capacidad', 'tipo'];
    const faltan = requeridos.filter((c) => datos[c] === undefined || datos[c] === null || datos[c] === '');
    if (faltan.length > 0) {
      return { status: 400, data: null, message: `Faltan datos: ${faltan.join(', ')}` };
    }
    const error = this.validarFormato(datos);
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await SalaModel.crear(datos);
    return { status: 201, data, message: 'Sala creada correctamente' };
  }

  async editar(id, datos = {}) {
    const actual = await SalaModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró la sala con id ${id}` };
    }
    const vacios = ['nombre', 'capacidad', 'tipo'].filter((c) => datos[c] === '' || datos[c] === null);
    if (vacios.length > 0) {
      return { status: 400, data: null, message: `Estos campos no pueden estar vacíos: ${vacios.join(', ')}` };
    }
    const error = this.validarFormato(datos);
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await SalaModel.actualizar(id, datos);
    return { status: 200, data, message: 'Sala actualizada correctamente' };
  }

  async eliminar(id) {
    const actual = await SalaModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró la sala con id ${id}` };
    }
    try {
      await SalaModel.eliminar(id);
    } catch (error) {
      // La base de datos no deja eliminar algo que otro registro está usando
      return { status: 400, data: null, message: 'No se puede eliminar porque tiene elementos relacionados' };
    }
    return { status: 200, data: actual, message: 'Sala eliminada correctamente' };
  }
}

export default new SalaController();
