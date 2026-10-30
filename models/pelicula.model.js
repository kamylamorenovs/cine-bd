import db from '../database/conexion.js';

// Modelo de películas: aquí están las consultas SQL de la tabla peliculas
class PeliculaModel {
  listar() {
    return db.listar('SELECT * FROM peliculas ORDER BY id');
  }

  buscarPorId(id) {
    return db.obtener('SELECT * FROM peliculas WHERE id = ?', [Number(id)]);
  }

  async crear(datos) {
    const resultado = await db.ejecutar(
      'INSERT INTO peliculas (titulo, genero, duracion, fechaEstreno) VALUES (?, ?, ?, ?)',
      [datos.titulo, datos.genero, Number(datos.duracion), datos.fechaEstreno]
    );
    return this.buscarPorId(resultado.id);
  }

  // Cambia solo los campos enviados y deja los demás como estaban
  async actualizar(id, datos) {
    const actual = await this.buscarPorId(id);
    const nuevo = { ...actual, ...datos };
    await db.ejecutar(
      'UPDATE peliculas SET titulo = ?, genero = ?, duracion = ?, fechaEstreno = ? WHERE id = ?',
      [nuevo.titulo, nuevo.genero, Number(nuevo.duracion), nuevo.fechaEstreno, Number(id)]
    );
    return this.buscarPorId(id);
  }

  // Devuelve true si se eliminó una fila
  async eliminar(id) {
    const resultado = await db.ejecutar('DELETE FROM peliculas WHERE id = ?', [Number(id)]);
    return resultado.cambios > 0;
  }

  // Las 5 películas con la fecha de estreno más reciente
  ultimas() {
    return db.listar('SELECT * FROM peliculas ORDER BY fechaEstreno DESC LIMIT 5');
  }
}

export default new PeliculaModel();
