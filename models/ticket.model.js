import db from '../database/conexion.js';

// Modelo de tickets: aquí están las consultas SQL de la tabla tickets
class TicketModel {
  listar() {
    return db.listar('SELECT * FROM tickets ORDER BY id');
  }

  buscarPorId(id) {
    return db.obtener('SELECT * FROM tickets WHERE id = ?', [Number(id)]);
  }

  async crear(datos) {
    const resultado = await db.ejecutar(
      'INSERT INTO tickets (reservacionId, asiento, precio) VALUES (?, ?, ?)',
      [datos.reservacionId == null ? null : Number(datos.reservacionId), datos.asiento, Number(datos.precio)]
    );
    return this.buscarPorId(resultado.id);
  }

  // Cambia solo los campos enviados y deja los demás como estaban
  async actualizar(id, datos) {
    const actual = await this.buscarPorId(id);
    const nuevo = { ...actual, ...datos };
    await db.ejecutar(
      'UPDATE tickets SET reservacionId = ?, asiento = ?, precio = ? WHERE id = ?',
      [nuevo.reservacionId == null ? null : Number(nuevo.reservacionId), nuevo.asiento, Number(nuevo.precio), Number(id)]
    );
    return this.buscarPorId(id);
  }

  // Devuelve true si se eliminó una fila
  async eliminar(id) {
    const resultado = await db.ejecutar('DELETE FROM tickets WHERE id = ?', [Number(id)]);
    return resultado.cambios > 0;
  }

  // Elimina la relación del ticket con su reservación, pero el ticket se conserva
  async quitarReservacion(id) {
    await db.ejecutar('UPDATE tickets SET reservacionId = NULL WHERE id = ?', [Number(id)]);
    return this.buscarPorId(id);
  }
}

export default new TicketModel();
