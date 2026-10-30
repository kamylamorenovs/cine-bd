import PeliculaModel from '../models/pelicula.model.js';

// Controlador de películas: valida los datos y devuelve { status, data, message }.
// No usa req ni res, y todos sus métodos son asíncronos (devuelven Promesas).
class PeliculaController {
  // Revisa que los datos enviados tengan el formato correcto
  validarFormato(datos) {
    if (datos.duracion !== undefined && datos.duracion !== null && (datos.duracion === '' || Number.isNaN(Number(datos.duracion)))) {
      return 'duracion debe ser un número';
    }
    if (datos.fechaEstreno !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(datos.fechaEstreno)) {
      return 'fechaEstreno debe tener el formato AAAA-MM-DD';
    }
    return null;
  }

  async listar() {
    const data = await PeliculaModel.listar();
    return { status: 200, data, message: 'Lista de películas' };
  }

  async ver(id) {
    const data = await PeliculaModel.buscarPorId(id);
    if (!data) {
      return { status: 404, data: null, message: `No se encontró la película con id ${id}` };
    }
    return { status: 200, data, message: 'Película encontrada' };
  }

  async agregar(datos = {}) {
    const requeridos = ['titulo', 'genero', 'duracion', 'fechaEstreno'];
    const faltan = requeridos.filter((c) => datos[c] === undefined || datos[c] === null || datos[c] === '');
    if (faltan.length > 0) {
      return { status: 400, data: null, message: `Faltan datos: ${faltan.join(', ')}` };
    }
    const error = this.validarFormato(datos);
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await PeliculaModel.crear(datos);
    return { status: 201, data, message: 'Película creada correctamente' };
  }

  async editar(id, datos = {}) {
    const actual = await PeliculaModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró la película con id ${id}` };
    }
    const vacios = ['titulo', 'genero', 'duracion', 'fechaEstreno'].filter((c) => datos[c] === '' || datos[c] === null);
    if (vacios.length > 0) {
      return { status: 400, data: null, message: `Estos campos no pueden estar vacíos: ${vacios.join(', ')}` };
    }
    const error = this.validarFormato(datos);
    if (error) {
      return { status: 400, data: null, message: error };
    }
    const data = await PeliculaModel.actualizar(id, datos);
    return { status: 200, data, message: 'Película actualizada correctamente' };
  }

  async eliminar(id) {
    const actual = await PeliculaModel.buscarPorId(id);
    if (!actual) {
      return { status: 404, data: null, message: `No se encontró la película con id ${id}` };
    }
    try {
      await PeliculaModel.eliminar(id);
    } catch (error) {
      // La base de datos no deja eliminar algo que otro registro está usando
      return { status: 400, data: null, message: 'No se puede eliminar porque tiene elementos relacionados' };
    }
    return { status: 200, data: actual, message: 'Película eliminada correctamente' };
  }

  async ultimas() {
    const data = await PeliculaModel.ultimas();
    return { status: 200, data, message: 'Últimas 5 películas por fecha de estreno' };
  }
}

export default new PeliculaController();
