// Estructura de las tablas y datos de ejemplo
export async function crearTablas(db) {
  await db.ejecutar(`CREATE TABLE IF NOT EXISTS peliculas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    genero TEXT NOT NULL,
    duracion INTEGER NOT NULL,
    fechaEstreno TEXT NOT NULL
  )`);
  await db.ejecutar(`CREATE TABLE IF NOT EXISTS salas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    capacidad INTEGER NOT NULL,
    tipo TEXT NOT NULL
  )`);
  await db.ejecutar(`CREATE TABLE IF NOT EXISTS funciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    peliculaId INTEGER NOT NULL REFERENCES peliculas(id),
    salaId INTEGER NOT NULL REFERENCES salas(id),
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    precio REAL NOT NULL
  )`);
  await db.ejecutar(`CREATE TABLE IF NOT EXISTS reservaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    funcionId INTEGER NOT NULL REFERENCES funciones(id),
    cliente TEXT NOT NULL,
    cantidad INTEGER NOT NULL
  )`);
  await db.ejecutar(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservacionId INTEGER REFERENCES reservaciones(id) ON DELETE SET NULL,
    asiento TEXT NOT NULL,
    precio REAL NOT NULL
  )`);
}

// Solo se cargan la primera vez, cuando la base de datos está vacía
export async function cargarDatosIniciales(db) {
  const { total } = await db.obtener('SELECT COUNT(*) AS total FROM peliculas');
  if (total > 0) return;

  const peliculas = [
    ['Interestelar', 'Ciencia ficción', 169, '2014-11-07'],
    ['Coco', 'Animación', 105, '2017-11-22'],
    ['Oppenheimer', 'Drama', 180, '2023-07-21'],
    ['Spider-Man: Un nuevo universo', 'Animación', 117, '2018-12-14'],
    ['Mad Max: Furia en el camino', 'Acción', 120, '2015-05-15'],
    ['Parásitos', 'Suspenso', 132, '2019-05-30'],
    ['Dune: Parte dos', 'Ciencia ficción', 166, '2024-03-01'],
    ['Intensamente 2', 'Animación', 96, '2024-06-14'],
  ];
  for (const p of peliculas) {
    await db.ejecutar('INSERT INTO peliculas (titulo, genero, duracion, fechaEstreno) VALUES (?, ?, ?, ?)', p);
  }

  await db.ejecutar('INSERT INTO salas (nombre, capacidad, tipo) VALUES (?, ?, ?)', ['Sala 1', 80, '2D']);
  await db.ejecutar('INSERT INTO salas (nombre, capacidad, tipo) VALUES (?, ?, ?)', ['Sala VIP', 30, '3D']);

  await db.ejecutar('INSERT INTO funciones (peliculaId, salaId, fecha, hora, precio) VALUES (?, ?, ?, ?, ?)', [1, 1, '2026-10-20', '18:00', 8]);
  await db.ejecutar('INSERT INTO funciones (peliculaId, salaId, fecha, hora, precio) VALUES (?, ?, ?, ?, ?)', [2, 2, '2026-10-22', '15:30', 10]);

  await db.ejecutar('INSERT INTO reservaciones (funcionId, cliente, cantidad) VALUES (?, ?, ?)', [1, 'Ana Pérez', 2]);

  await db.ejecutar('INSERT INTO tickets (reservacionId, asiento, precio) VALUES (?, ?, ?)', [1, 'A1', 8]);
  await db.ejecutar('INSERT INTO tickets (reservacionId, asiento, precio) VALUES (?, ?, ?)', [1, 'A2', 8]);
}
