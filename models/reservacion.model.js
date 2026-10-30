import db from '../database/conexion.js';

// Modelo de reservaciones: aquí están las consultas SQL de la tabla reservaciones
class ReservacionModel {
  listar() {
    return db.listar('SELECT * FROM reservaciones ORDER BY id');
  }

  buscarPorId(id) {
    return db.obtener('SELECT * FROM reservaciones WHERE id = ?', [Number(id)]);
  }

  async crear(datos) {
    const resultado = await db.ejecutar(
      'INSERT INTO reservaciones (funcionId, cliente, cantidad) VALUES (?, ?, ?)',
      [Number(datos.funcionId), datos.cliente, Number(datos.cantidad)]
    );
    return this.buscarPorId(resultado.id);
  }

  // Cambia solo los campos enviados y deja los demás como estaban
  async actualizar(id, datos) {
    const actual = await this.buscarPorId(id);
    const nuevo = { ...actual, ...datos };
    await db.ejecutar(
      'UPDATE reservaciones SET funcionId = ?, cliente = ?, cantidad = ? WHERE id = ?',
      [Number(nuevo.funcionId), nuevo.cliente, Number(nuevo.cantidad), Number(id)]
    );
    return this.buscarPorId(id);
  }

  // Devuelve true si se eliminó una fila
  async eliminar(id) {
    const resultado = await db.ejecutar('DELETE FROM reservaciones WHERE id = ?', [Number(id)]);
    return resultado.cambios > 0;
  }

  // Reservaciones con los datos de su función y la cantidad de tickets
  listarDetalle() {
    return db.listar(`SELECT r.id, r.funcionId, r.cliente, r.cantidad, p.titulo AS pelicula, f.fecha, f.hora,
      (SELECT COUNT(*) FROM tickets t WHERE t.reservacionId = r.id) AS tickets
      FROM reservaciones r
      JOIN funciones f ON f.id = r.funcionId
      JOIN peliculas p ON p.id = f.peliculaId
      ORDER BY r.id`);
  }

  ticketsDe(id) {
    return db.listar('SELECT * FROM tickets WHERE reservacionId = ? ORDER BY id', [Number(id)]);
  }
}

export default new ReservacionModel();
