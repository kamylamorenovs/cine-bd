import db from '../database/conexion.js';

const DETALLE = `SELECT f.id, f.peliculaId, f.salaId, f.fecha, f.hora, f.precio, p.titulo AS pelicula, s.nombre AS sala
  FROM funciones f
  JOIN peliculas p ON p.id = f.peliculaId
  JOIN salas s ON s.id = f.salaId`;

// Modelo de funciones: aquí están las consultas SQL de la tabla funciones
class FuncionModel {
  listar() {
    return db.listar('SELECT * FROM funciones ORDER BY id');
  }

  buscarPorId(id) {
    return db.obtener('SELECT * FROM funciones WHERE id = ?', [Number(id)]);
  }

  async crear(datos) {
    const resultado = await db.ejecutar(
      'INSERT INTO funciones (peliculaId, salaId, fecha, hora, precio) VALUES (?, ?, ?, ?, ?)',
      [Number(datos.peliculaId), Number(datos.salaId), datos.fecha, datos.hora, Number(datos.precio)]
    );
    return this.buscarPorId(resultado.id);
  }

  // Cambia solo los campos enviados y deja los demás como estaban
  async actualizar(id, datos) {
    const actual = await this.buscarPorId(id);
    const nuevo = { ...actual, ...datos };
    await db.ejecutar(
      'UPDATE funciones SET peliculaId = ?, salaId = ?, fecha = ?, hora = ?, precio = ? WHERE id = ?',
      [Number(nuevo.peliculaId), Number(nuevo.salaId), nuevo.fecha, nuevo.hora, Number(nuevo.precio), Number(id)]
    );
    return this.buscarPorId(id);
  }

  // Devuelve true si se eliminó una fila
  async eliminar(id) {
    const resultado = await db.ejecutar('DELETE FROM funciones WHERE id = ?', [Number(id)]);
    return resultado.cambios > 0;
  }

  // Función junto con el título de su película y el nombre de su sala
  listarDetalle() {
    return db.listar(`${DETALLE} ORDER BY f.id`);
  }

  detalle(id) {
    return db.obtener(`${DETALLE} WHERE f.id = ?`, [Number(id)]);
  }

  // Funciones cuya fecha está entre dos fechas (AAAA-MM-DD)
  rango(desde, hasta) {
    return db.listar('SELECT * FROM funciones WHERE fecha BETWEEN ? AND ? ORDER BY fecha, hora', [desde, hasta]);
  }
}

export default new FuncionModel();
