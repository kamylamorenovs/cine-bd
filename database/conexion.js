import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { crearTablas, cargarDatosIniciales } from './esquema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Clase que maneja la conexión con la base de datos SQLite (archivo cine.db).
// Todos sus métodos devuelven Promesas; el resto del sistema las usa con async/await.
class BaseDatos {
  constructor(archivo) {
    this.archivo = archivo;
    this.db = null;
  }

  // Abre la base de datos, crea las tablas si no existen y carga datos de ejemplo la primera vez
  async iniciar() {
    this.db = new DatabaseSync(this.archivo);
    this.db.exec('PRAGMA foreign_keys = ON');
    await crearTablas(this);
    await cargarDatosIniciales(this);
  }

  // INSERT, UPDATE, DELETE y CREATE: devuelve el id insertado y la cantidad de filas cambiadas
  ejecutar(sql, parametros = []) {
    return new Promise((resolve, reject) => {
      try {
        const resultado = this.db.prepare(sql).run(...parametros);
        resolve({ id: Number(resultado.lastInsertRowid), cambios: Number(resultado.changes) });
      } catch (error) {
        reject(error);
      }
    });
  }

  // SELECT de una sola fila (devuelve null si no hay)
  obtener(sql, parametros = []) {
    return new Promise((resolve, reject) => {
      try {
        const fila = this.db.prepare(sql).get(...parametros);
        resolve(fila ?? null);
      } catch (error) {
        reject(error);
      }
    });
  }

  // SELECT de varias filas
  listar(sql, parametros = []) {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.db.prepare(sql).all(...parametros));
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new BaseDatos(path.join(__dirname, '..', 'cine.db'));
