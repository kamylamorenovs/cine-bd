import FuncionModel from '../models/funcion.model.js';
import PeliculaModel from '../models/pelicula.model.js';
import SalaModel from '../models/sala.model.js';

// Controlador de funciones: valida los datos y devuelve { status, data, message }.
// No usa req ni res, y todos sus métodos son asíncronos (devuelven Promesas).
class FuncionController {
  // Revisa que los datos enviados tengan el formato correcto
  validarFormato(datos) {
    if (datos.precio !== undefined && datos.precio !== null && (datos.precio === '' || Number.isNaN(Number(datos.precio)))) {
      return 'precio debe ser un número';
    }
    if (datos.fecha !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
      return 'fecha debe tener el formato AAAA-MM-DD';
    }
    return null;
  }

  // Revisa que los datos relacionados existan en la base de datos
  async revisarRelaciones(datos) {
    if (datos.peliculaId !== undefined && datos.peliculaId !== null && !(await PeliculaModel.buscarPorId(datos.peliculaId))) {
      return 'La película indicada no existe';
    }
    if (datos.salaId !== undefined && datos.salaId !== null && !(await SalaModel.buscarPorId(datos.salaId))) {
      return 'La sala indicada no existe';
    }
    return null;
  }

  async listar() {
    const data = await FuncionModel.listar();
    return { status: 200, data, message: 'Lista de funciones' };
  }

  async ver(id) {
    const data = await FuncionModel.buscarPorId(id);
    if (!data) {
      return { status: 404, data: null, message: `No se encontró la función con id ${id}` };
    }
    return { status: 200, data, message: 'Función encontrada' };
  }

  async agregar(datos = {}) {
    const requeridos = ['peliculaId', 'salaId', 'fecha', 'hora', 'precio'];
    const faltan = requeridos.filter((c) => datos[c] === undefined || datos[c] === null || datos[c] === '');
    if (faltan.length > 0) {
      return { status: 400, data: null, message: `Faltan datos: ${faltan.join(', ')}` };
    }
    const error = this.validarFormato(datos) || (await this.revisarRelaciones(datos));
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await FuncionModel.crear(datos);
    return { status: 201, data, message: 'Función creada correctamente' };
  }

  async editar(id, datos = {}) {
    const actual = await FuncionModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró la función con id ${id}` };
    }
    const vacios = ['peliculaId', 'salaId', 'fecha', 'hora', 'precio'].filter((c) => datos[c] === '' || datos[c] === null);
    if (vacios.length > 0) {
      return { status: 400, data: null, message: `Estos campos no pueden estar vacíos: ${vacios.join(', ')}` };
    }
    const error = this.validarFormato(datos) || (await this.revisarRelaciones(datos));
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await FuncionModel.actualizar(id, datos);
    return { status: 200, data, message: 'Función actualizada correctamente' };
  }

  async eliminar(id) {
    const actual = await FuncionModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró la función con id ${id}` };
    }
    try {
      await FuncionModel.eliminar(id);
    } catch (error) {
      // La base de datos no deja eliminar algo que otro registro está usando
      return { status: 400, data: null, message: 'No se puede eliminar porque tiene elementos relacionados' };
    }
    return { status: 200, data: actual, message: 'Función eliminada correctamente' };
  }

  async listarDetalle() {
    const data = await FuncionModel.listarDetalle();
    return { status: 200, data, message: 'Funciones con su película y su sala' };
  }

  async detalle(id) {
    const data = await FuncionModel.detalle(id);
    if (!data) {
      return { status: 404, data: null, message: `No se encontró la función con id ${id}` };
    }
    return { status: 200, data, message: 'Detalle de la función' };
  }

  async rango(desde, hasta) {
    if (!desde || !hasta) {
      return { status: 400, data: null, message: 'Debe enviar desde y hasta (AAAA-MM-DD)' };
    }
    const formato = /^\d{4}-\d{2}-\d{2}$/;
    if (!formato.test(desde) || !formato.test(hasta)) {
      return { status: 400, data: null, message: 'Las fechas deben tener el formato AAAA-MM-DD' };
    }
    const data = await FuncionModel.rango(desde, hasta);
    return { status: 200, data, message: `Funciones entre ${desde} y ${hasta}` };
  }
}

export default new FuncionController();
