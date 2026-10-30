# Sistema de cine con base de datos (e-actividad 2)

Sistema para un cine hecho con Node.js, Express, SQLite y EJS. Permite hacer operaciones CRUD (crear, consultar, editar y eliminar) sobre cinco entidades: películas, salas, funciones, reservaciones y tickets. Los datos se guardan en una base de datos, así que no se pierden al apagar el servidor.

## Requisitos
- Node.js 22.13 o superior (se comprueba con `node -v`). La base de datos usa el módulo `node:sqlite`, que viene incluido en Node.js, por lo que no hay que instalar ni configurar ningún servidor de base de datos.
- Git.
- Visual Studio Code con la extensión Thunder Client (o Postman) para probar la API.

## Instalación
```
git clone URL_DEL_REPOSITORIO
cd NOMBRE_DE_LA_CARPETA
npm i
```

## Ejecución
```
npm start
```
También se puede usar `npx nodemon ./bin/www`, que reinicia el servidor al guardar cambios (en ese caso aparece un aviso de "ExperimentalWarning" por el módulo SQLite; es normal).

Cuando aparece el mensaje `Servidor listo en http://localhost:3000`, abrir esa dirección en el navegador. Se puede cambiar el puerto con la variable de entorno `PORT`. No se necesita archivo `.env`.

## Base de datos
- Es SQLite y se guarda en el archivo `cine.db`, que se crea solo la primera vez que se inicia el servidor, con las tablas y algunos datos de ejemplo.
- Para volver a los datos de ejemplo, detener el servidor, borrar el archivo `cine.db` y volver a iniciar.

## Estructura del proyecto
```
app.js               configuración de Express y conexión de rutas
bin/www              arranque: abre la base de datos y levanta el servidor
database/            conexion.js (clase BaseDatos) y esquema.js (tablas y datos de ejemplo)
models/              una clase por entidad con las consultas SQL
controllers/         una clase por entidad con la lógica (validaciones y respuestas)
routes/              enrutadores de la API y de las vistas
views/               vistas EJS
public/stylesheets/  hoja de estilos
```
La separación de intereses es así: las rutas manejan HTTP, los controladores validan y deciden la respuesta, y los modelos hablan con la base de datos. Todo el acceso a la base de datos devuelve Promesas y se usa con async/await.

## Vistas (navegador)
| Dirección | Qué permite |
|---|---|
| `/` | Inicio, con el total de elementos |
| `/vistas/peliculas` | Ver, crear, editar y eliminar películas |
| `/vistas/salas` | Ver, crear, editar y eliminar salas |
| `/vistas/funciones` | Consultar las funciones (con película y sala) |
| `/vistas/reservaciones` | Consultar las reservaciones (con su función y cantidad de tickets) |

En las vistas de películas y salas:
1. **Crear:** pulsar el botón *Nueva película* (o *Nueva sala*), llenar el formulario y pulsar *Guardar*.
2. **Editar:** pulsar *Editar* en la fila, cambiar los datos y pulsar *Guardar*.
3. **Eliminar:** pulsar *Eliminar* en la fila y confirmar. Si la película o la sala tiene funciones, se muestra un aviso y no se elimina.

## API (para probar con Thunder Client o Postman)
En las rutas, `{entidad}` puede ser `peliculas`, `salas`, `funciones`, `reservaciones` o `tickets`. Las respuestas son `{ "data": ..., "message": "..." }`.

| Método | Ruta | Acción |
|---|---|---|
| GET | `/{entidad}/all` | Listar |
| GET | `/{entidad}/:id` | Ver por id |
| POST | `/{entidad}/create` | Crear (datos en Body, JSON) |
| PUT | `/{entidad}/:id` | Editar |
| DELETE | `/{entidad}/:id` | Eliminar |
| GET | `/peliculas/ultimas` | Últimas 5 películas por fecha de estreno |
| GET | `/funciones/rango?desde=AAAA-MM-DD&hasta=AAAA-MM-DD` | Funciones dentro de un rango de fechas |
| GET | `/funciones/:id/detalle` | Función con su película y su sala |
| GET | `/reservaciones/:id/tickets` | Tickets de una reservación |
| DELETE | `/tickets/:id/reservacion` | Quitar la relación de un ticket con su reservación |

Códigos de estado: 200 (correcto), 201 (creado), 400 (datos inválidos, relación inexistente o elemento con relaciones que impiden eliminarlo) y 404 (id no encontrado).

### Campos para crear
- Película: `titulo`, `genero`, `duracion`, `fechaEstreno` (AAAA-MM-DD)
- Sala: `nombre`, `capacidad`, `tipo`
- Función: `peliculaId`, `salaId`, `fecha` (AAAA-MM-DD), `hora`, `precio`
- Reservación: `funcionId`, `cliente`, `cantidad`
- Ticket: `reservacionId`, `asiento`, `precio`

### Ejemplo
`POST http://localhost:3000/peliculas/create` con este Body (JSON):
```
{ "titulo": "Shrek", "genero": "Animación", "duracion": 90, "fechaEstreno": "2001-05-18" }
```
La respuesta tiene el código 201 y la película aparece en `/vistas/peliculas`.
