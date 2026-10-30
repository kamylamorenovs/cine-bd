import db from '../database/conexion.js';

// Modelo de salas: aquí están las consultas SQL de la tabla salas
class SalaModel {
  listar() {
    return db.listar('SELECT * FROM salas ORDER BY id');
  }

  buscarPorId(id) {
    return db.obtener('SELECT * FROM salas WHERE id = ?', [Number(id)]);
  }

  async crear(datos) {
    const resultado = await db.ejecutar(
      'INSERT INTO salas (nombre, capacidad, tipo) VALUES (?, ?, ?)',
      [datos.nombre, Number(datos.capacidad), datos.tipo]
    );
    return this.buscarPorId(resultado.id);
  }

  // Cambia solo los campos enviados y deja los demás como estaban
  async actualizar(id, datos) {
    const actual = await this.buscarPorId(id);
    const nuevo = { ...actual, ...datos };
    await db.ejecutar(
      'UPDATE salas SET nombre = ?, capacidad = ?, tipo = ? WHERE id = ?',
      [nuevo.nombre, Number(nuevo.capacidad), nuevo.tipo, Number(id)]
    );
    return this.buscarPorId(id);
  }

  // Devuelve true si se eliminó una fila
  async eliminar(id) {
    const resultado = await db.ejecutar('DELETE FROM salas WHERE id = ?', [Number(id)]);
    return resultado.cambios > 0;
  }
}

export default new SalaModel();
