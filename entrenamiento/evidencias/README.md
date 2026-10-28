# ENTRENAMIENTO - Venue Control (Serverless)

## 1. Descripción

Venue Control es una adaptación del ejercicio Festival Control a un dominio distinto: la **gestión de zonas de un recinto**. Una aplicación móvil desarrollada con React Native y Expo permite listar zonas, consultar una zona concreta, crearla, reemplazarla, cambiar su estado y eliminarla.

La aplicación se comunica con una API REST sin servidor: **API Gateway** recibe las peticiones HTTP y **AWS Lambda** ejecuta una función por operación. En desarrollo, el mismo backend se prueba en local con **Serverless Offline**, sin desplegar cada cambio.

> [!NOTE]
> El backend **no tiene base de datos**. El catálogo de zonas está definido en el código y las escrituras (POST, PUT, PATCH y DELETE) son **simuladas**: responden con éxito pero no guardan nada. Por tanto, no debe asumirse que un cambio aparecerá en una consulta GET posterior.

## 2. Tecnologías utilizadas

- **Frontend:** React Native, Expo y TypeScript.
- **Backend:** Serverless Framework con handlers en TypeScript.
- **Ejecución en la nube:** AWS Lambda y Amazon API Gateway.
- **Pruebas locales:** Serverless Offline.
- **Registro de ejecuciones:** Amazon CloudWatch.
- **Comunicación:** API REST mediante peticiones HTTP/HTTPS con datos en JSON.
- **Herramientas de prueba:** Thunder Client y `curl`.

## 3. Estructura del proyecto

La adaptación se mantiene en la carpeta `entrenamiento/` para no modificar el proyecto original:

```text
04-PILARES-SERVERLESS/
└── entrenamiento/
    ├── backend/
    │   ├── serverless.yml
    │   ├── package.json
    │   └── src/
    │       ├── model/zone.ts
    │       └── zones/
    │           ├── list.ts
    │           ├── get.ts
    │           ├── create.ts
    │           ├── replace.ts
    │           ├── update.ts
    │           └── delete.ts
    ├── mobile/
    │   ├── App.tsx
    │   ├── package.json
    │   └── src/
    │       ├── api.ts
    │       └── types.ts

```

| Carpeta o archivo | Función |
|---|---|
| `backend/serverless.yml` | Declara el servicio, las seis funciones y sus rutas HTTP. |
| `backend/src/zones/*.ts` | Un handler por operación. |
| `backend/src/model/zone.ts` | Modelo de zona, catálogo y validación. |
| `mobile/App.tsx` | Interfaz y navegación entre pantallas. |
| `mobile/src/api.ts` | URL base y funciones HTTP de los seis endpoints. |
| `mobile/src/types.ts` | Tipos `Zone`, `ZoneInput` y `ZoneStatus`. |
| `scripts/probar-api.sh` | Ejecuta las pruebas HTTP y guarda cada salida real como evidencia. |
| `evidencias/` | Salidas reales de las pruebas contra local y contra AWS. |

## 4. Arquitectura

```text
DESARROLLO LOCAL
Expo / React Native
       │  HTTP + JSON
       ▼
Serverless Offline  (localhost:3000/dev)
       ▼
Handlers TypeScript


DESPLIEGUE AWS
Expo / React Native
       │  HTTPS + JSON
       ▼
API Gateway  (/dev/zones)
       ▼
AWS Lambda  (seis funciones)
       ▼
Catálogo definido en código
       │
       └── CloudWatch: logs de ejecución
```

| Elemento | Responsabilidad |
|---|---|
| **App móvil** | Interfaz. Construye la petición, la envía y muestra el resultado o el error. |
| **API Gateway** | Punto de entrada HTTPS. Enruta cada método y ruta a su función. |
| **Lambda** | Ejecuta el handler: lee parámetros y cuerpo, valida y construye la respuesta. |
| **Catálogo en código** | Sustituye a una base de datos. Es de solo lectura en la práctica. |
| **CloudWatch** | Recoge los logs de cada invocación. |
| **Serverless Offline** | Emula API Gateway y Lambda en el ordenador. |

## 5. Modelo de datos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | texto | Identificador de la zona (por ejemplo, `ZONE-07`). |
| `name` | texto | Nombre de la zona. No puede estar vacío. |
| `capacity` | número entero | Aforo máximo. Debe ser positivo. |
| `status` | texto | Estado de la zona: `OPEN`, `FULL` o `CLOSED`. |

```json
{
  "id": "ZONE-07",
  "name": "Garden Stage",
  "capacity": 2500,
  "status": "OPEN"
}
```

Catálogo inicial definido en el backend:

| id | name | capacity | status |
|---|---|---|---|
| `ZONE-07` | Garden Stage | 2500 | `OPEN` |
| `ZONE-08` | Main Arena | 5000 | `FULL` |

## 6. API REST

| Método | Ruta | Función Lambda | Descripción |
|---|---|---|---|
| GET | `/dev/zones` | `listZones` | Lista las zonas. |
| GET | `/dev/zones/{id}` | `getZone` | Consulta una zona. |
| POST | `/dev/zones` | `createZone` | Simula la creación. |
| PUT | `/dev/zones/{id}` | `replaceZone` | Simula el reemplazo completo. |
| PATCH | `/dev/zones/{id}` | `updateZone` | Simula una actualización parcial. |
| DELETE | `/dev/zones/{id}` | `deleteZone` | Simula la eliminación. |

**Cuerpo de POST y PUT:**

```json
{"name":"Garden Stage","capacity":2500,"status":"OPEN"}
```

**Cuerpo de PATCH:**

```json
{"status":"CLOSED"}
```

**Validación en el backend:**

- `name` no puede estar vacío.
- `capacity` debe ser un entero positivo.
- `status` debe ser `OPEN`, `FULL` o `CLOSED`.
- El cuerpo JSON se parsea de forma segura y se valida **antes** de usarlo.

La validación se hace en el servidor y no solo en la interfaz, porque cualquier cliente (`curl`, Thunder Client, otra app) puede enviar datos sin pasar por los formularios de la app.

## 7. Funcionamiento

1. La app móvil construye la petición con `fetch` a partir de `API_URL` y la ruta del recurso.
2. La petición llega a Serverless Offline (en local) o a API Gateway (en AWS).
3. La ruta declarada en `serverless.yml` asocia la petición a una función.
4. El handler lee el `id` (`event.pathParameters.id`) o el cuerpo (`event.body`), valida los datos y construye la respuesta JSON.
5. La respuesta vuelve a la app, que comprueba `response.ok`.
6. Si todo es correcto, la interfaz muestra el resultado; si falla, muestra un mensaje de error.
7. En AWS, cada invocación deja un registro en CloudWatch.

El recorrido detallado de una petición está en la sección 13.

## 8. Instalación y ejecución en local

### Backend

Desde `entrenamiento/backend`:

```bash
npm install
npm run typecheck
npm start
```

- `npm run typecheck` comprueba los tipos de TypeScript sin generar archivos.
- `npm start` ejecuta `npm run build && serverless offline`: compila TypeScript y arranca el servidor local.

Con el servidor activo, la terminal anuncia las rutas:

```text
GET     http://localhost:3000/dev/zones
POST    http://localhost:3000/dev/zones
GET     http://localhost:3000/dev/zones/{id}
PUT     http://localhost:3000/dev/zones/{id}
PATCH   http://localhost:3000/dev/zones/{id}
DELETE  http://localhost:3000/dev/zones/{id}
```

También aparece un listener de invocación de Lambda en `http://localhost:3002`. Ese puerto es interno de la emulación: las peticiones HTTP de la app y de las pruebas van siempre a las rutas `/dev/zones` del puerto `3000`.

> [!IMPORTANT]
> Mantén abierta la terminal de `npm start` mientras haces pruebas locales: ahí aparece el registro de cada invocación.

### Aplicación móvil

Desde `entrenamiento/mobile`:

```bash
npm install
npx expo start
```

Expo arranca Metro y muestra el código QR y los atajos de teclado:

| Atajo | Acción |
|---|---|
| `w` | Abrir la app en el navegador (`http://localhost:8081`). |
| `a` | Abrir en un emulador Android. |
| `r` | Recargar la app. |
| `Ctrl + C` | Detener Expo. |

Para probarla en el ordenador, pulsa `w`.

### Cambiar entre local y AWS

En `mobile/src/api.ts`, `API_URL` es la **URL base**. No debe terminar en `/zones`, porque cada función de `api.ts` añade su propia ruta.

**Backend local, con Expo Web en el mismo ordenador:**

```typescript
export const API_URL = 'http://localhost:3000/dev';
```

**AWS:**

```typescript
export const API_URL = 'https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev';
```

**Backend local, con un móvil físico:** `localhost` apunta al propio móvil, no al ordenador. Hay que usar la IP local del PC (la que anuncia Expo, por ejemplo `exp://172.20.10.2:8081`) y hacer que Serverless Offline escuche en todas las interfaces:

```bash
npx serverless offline --host 0.0.0.0
```

```typescript
export const API_URL = 'http://172.20.10.2:3000/dev';
```

El móvil y el ordenador deben estar en la misma red.

**Procedimiento para cambiar de forma controlada:**

1. Modificar **solo** `API_URL`.
2. Recargar la app (`r` en la terminal de Expo).
3. Comprobar a dónde va realmente la petición: en la pestaña Network del navegador, o por si aparecen líneas nuevas en la terminal de Serverless Offline.
4. Para demostrar que se usa AWS, **apagar el backend local** y repetir una operación.

## 9. Pruebas de la API

### 9.1 Por qué se prueba primero con Thunder Client y `curl`

Se prueba la API con un cliente HTTP genérico **antes** de usar la aplicación React Native por tres motivos:

1. **Aísla las capas.** Si la API responde bien en Thunder Client, cualquier fallo posterior está en la app (URL, parseo, estado de la interfaz) y no en el backend.
2. **Muestra todo.** Un cliente HTTP enseña el código de estado, las cabeceras y el cuerpo exactos; la app los oculta tras su interfaz.
3. **Es más rápido de iterar.** Se puede repetir la misma petición sin pasar por navegación ni formularios.

### 9.2 Evidencias reales con el script

El script `scripts/probar-api.sh` ejecuta las pruebas y guarda cada salida real (fecha UTC, orden `curl` y respuesta completa) en un archivo de texto. Desde `entrenamiento/`, con Git Bash y el backend local en marcha:

```bash
./scripts/probar-api.sh http://localhost:3000/dev evidencias/local
```

Genera estos archivos:

| Archivo | Prueba |
|---|---|
| `01-get-lista.txt` | `GET /zones` |
| `02-get-detalle.txt` | `GET /zones/ZONE-07` |
| `03-get-inexistente.txt` | `GET /zones/NO-EXISTE` |
| `04-post-crear.txt` | `POST /zones` con un cuerpo válido |
| `05-put-reemplazar.txt` | `PUT /zones/ZONE-07` |
| `06-patch-estado.txt` | `PATCH /zones/ZONE-07` |
| `07-delete-eliminar.txt` | `DELETE /zones/ZONE-07` |
| `08-post-invalido.txt` | `POST /zones` con datos no válidos |
| `09-patch-estado-invalido.txt` | `PATCH` con un estado no permitido |

Después, se hace commit de la carpeta `evidencias/`.

### 9.3 Thunder Client

Se crea una colección con una petición por operación. Para POST, PUT y PATCH, la cabecera es `Content-Type: application/json`.

| Operación | Método y URL | Cuerpo |
|---|---|---|
| Listar | `GET http://localhost:3000/dev/zones` | (ninguno) |
| Consultar | `GET http://localhost:3000/dev/zones/ZONE-07` | (ninguno) |
| Crear | `POST http://localhost:3000/dev/zones` | `{"name":"Zona Norte","capacity":2500,"status":"OPEN"}` |
| Reemplazar | `PUT http://localhost:3000/dev/zones/ZONE-07` | `{"name":"Garden Stage","capacity":3000,"status":"FULL"}` |
| Actualizar | `PATCH http://localhost:3000/dev/zones/ZONE-07` | `{"status":"CLOSED"}` |
| Eliminar | `DELETE http://localhost:3000/dev/zones/ZONE-07` | (ninguno) |

**Qué se comprueba en cada una:**

| Operación | Resultado esperado según el contrato |
|---|---|
| Listar | Código 200 y un array con las zonas del catálogo. |
| Consultar (existente) | Código 200 y la zona `ZONE-07`. |
| Consultar (inexistente) | Una respuesta de error definida por el handler, no un 200. |
| Crear, reemplazar, actualizar y eliminar | Respuesta correcta de la escritura simulada. |
| Cuerpo no válido | Un error de validación; la escritura no se acepta. |

El código y el cuerpo **exactos** de cada respuesta son los que quedan registrados en los archivos de `evidencias/`; este documento no los reproduce para no afirmar nada que no esté respaldado por una salida real.

### 9.4 `curl` desde Git Bash

```bash
# GET del catálogo
curl -i http://localhost:3000/dev/zones

# GET de una zona existente
curl -i http://localhost:3000/dev/zones/ZONE-07

# GET de una zona inexistente
curl -i http://localhost:3000/dev/zones/NO-EXISTE

# POST
curl -i -X POST http://localhost:3000/dev/zones \
  -H "Content-Type: application/json" \
  -d '{"name":"Zona Norte","capacity":2500,"status":"OPEN"}'

# PUT
curl -i -X PUT http://localhost:3000/dev/zones/ZONE-07 \
  -H "Content-Type: application/json" \
  -d '{"name":"Garden Stage","capacity":3000,"status":"FULL"}'

# PATCH
curl -i -X PATCH http://localhost:3000/dev/zones/ZONE-07 \
  -H "Content-Type: application/json" \
  -d '{"status":"CLOSED"}'

# DELETE
curl -i -X DELETE http://localhost:3000/dev/zones/ZONE-07
```

La opción `-i` incluye en la salida la línea de estado y las cabeceras.

### 9.5 Resultados obtenidos en local

**`GET /dev/zones`:** respuesta `HTTP 200` con el catálogo:

```json
[
  {"id":"ZONE-07","name":"Garden Stage","capacity":2500,"status":"OPEN"},
  {"id":"ZONE-08","name":"Main Arena","capacity":5000,"status":"FULL"}
]
```

La terminal de Serverless Offline registró la ruta `GET /dev/zones`, la invocación de la función `listZones` y la línea `INFO LIST zonas`.

**`GET /dev/zones/ZONE-07`:** la terminal registró la invocación de `getZone` y la línea `INFO GET zona: ZONE-07`.

**`GET /dev/zones/NO-EXISTE`:** la terminal registró la invocación de `getZone` para ese identificador. El código y el cuerpo de esa respuesta se consultan en `evidencias/local/03-get-inexistente.txt`.

El resto de operaciones (POST, PUT, PATCH, DELETE y los casos con datos no válidos) se documentan con las salidas reales de `evidencias/local/`.

## 10. Aplicación móvil

Archivos principales:

- `App.tsx`: interfaz y navegación entre LISTADO, DETALLE, NUEVO y EDITAR.
- `src/types.ts`: tipos `Zone`, `ZoneInput` y `ZoneStatus`.
- `src/api.ts`: URL base y funciones HTTP para los seis endpoints.

### Arranque verificado

`npx expo start`, desde `entrenamiento/mobile`, arrancó Metro, anunció `http://localhost:8081` para web y generó el bundle (`Web Bundled`, 181 módulos). Con la pulsación `w` se abre la app en el navegador.

Esto demuestra que el entorno arrancó; las operaciones HTTP se verifican con las pruebas de la sección 9 y con el uso de cada pantalla.

### Funcionalidades

| Pantalla o acción | Operación HTTP |
|---|---|
| LISTADO | `GET /zones` |
| DETALLE | `GET /zones/{id}` |
| NUEVO | `POST /zones` |
| EDITAR | `PUT /zones/{id}` |
| Cambio de estado | `PATCH /zones/{id}` |
| Eliminación (con confirmación en dos pasos) | `DELETE /zones/{id}` |

Detalles de comportamiento:

- DETALLE y EDITAR necesitan una zona elegida en el listado. Si no la hay, la app avisa y vuelve al listado.
- Los errores y la respuesta de la API se muestran justo debajo del menú.
- Como el backend simula las escrituras, la app **actualiza el listado en local** tras cada operación correcta. El botón "Recargar listado · GET" vuelve a consultar el catálogo real del servidor, que puede no reflejar esos cambios.
- La API trata las respuestas sin cuerpo (por ejemplo, un DELETE con código 204) y las que no son JSON, para que una operación correcta no se muestre como un error.

## 11. Despliegue en AWS

### Comando

Desde `entrenamiento/backend`:

```bash
npx serverless deploy
```

### Qué crea `serverless deploy`

No se limita a publicar una URL. El comando empaqueta el código, lo sube y crea o actualiza un **stack de CloudFormation** con los recursos del servicio:

| Recurso | Para qué sirve |
|---|---|
| Paquete de código en un bucket de S3 | Almacena el código empaquetado de las funciones. |
| Stack `venue-control-api-dev` | Agrupa y versiona toda la infraestructura del servicio. |
| Seis funciones Lambda | Una por operación. |
| API REST en API Gateway con la etapa `dev` | Expone `/zones` y `/zones/{id}`. |
| Permisos de invocación | Permiten que API Gateway ejecute cada Lambda. |
| Grupos de logs en CloudWatch | Reciben el registro de cada invocación. |
| Rol de ejecución de IAM | Define lo que las funciones pueden hacer. |

### Problema de permisos y cómo se resolvió

Los primeros intentos de despliegue fallaron porque el usuario del laboratorio no tenía el permiso `iam:CreateRole`, necesario para que el framework cree el rol de ejecución de las funciones. El mensaje también señalaba un problema de permisos de etiquetado en IAM (`UnauthorizedTaggingOperation`).

La advertencia de Node `DEP0169`, sobre `url.parse()`, aparece en la salida pero **no fue la causa** del fallo.

Si el entorno proporciona un rol existente (como `LabRole` en los laboratorios), se indica en `provider.iam.role` de `serverless.yml` para que el framework no tenga que crear uno.

En el intento posterior, la salida confirmó el despliegue:

```text
Service deployed to stack venue-control-api-dev
```

### Endpoints publicados

```text
GET    https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev/zones
GET    https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev/zones/{id}
POST   https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev/zones
PUT    https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev/zones/{id}
PATCH  https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev/zones/{id}
DELETE https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev/zones/{id}
```

### Funciones Lambda desplegadas

- `venue-control-api-dev-listZones`
- `venue-control-api-dev-getZone`
- `venue-control-api-dev-createZone`
- `venue-control-api-dev-replaceZone`
- `venue-control-api-dev-updateZone`
- `venue-control-api-dev-deleteZone`

Para consultar el servicio desplegado en cualquier momento:

```bash
npx serverless info
```

## 12. Pruebas contra AWS

Las pruebas son las mismas de la sección 9; solo cambia la URL base.

```bash
# GET del catálogo
curl -i https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev/zones

# GET de una zona
curl -i https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev/zones/ZONE-07
```

Con el script, que guarda las salidas reales en `evidencias/aws/`:

```bash
./scripts/probar-api.sh https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev evidencias/aws
```

En Thunder Client se duplica la colección y se sustituye `http://localhost:3000/dev` por la URL de AWS.

**Aplicación contra AWS:** se cambia `API_URL` (sección 8), se recarga la app y se **apaga el backend local**. Si la app sigue funcionando, solo puede estar usando AWS.

## 13. Logs en AWS

Para consultar los logs de una función:

```bash
npx serverless logs -f listZones
```

Para seguirlos en tiempo real:

```bash
npx serverless logs -f listZones --tail
```

También se pueden consultar en **CloudWatch**, en el grupo de logs `/aws/lambda/venue-control-api-dev-listZones`.

**Cómo demostrar una invocación provocada desde la app:**

1. Apuntar `API_URL` a AWS y recargar la app.
2. Dejar `npx serverless logs -f listZones --tail` en una terminal.
3. En la app, pulsar **Recargar listado · GET** y anotar la hora.
4. En los logs debe aparecer la invocación correspondiente: líneas `START`, `END` y `REPORT` con un `RequestId`.
5. Guardar esas líneas en `evidencias/aws/logs-listZones.txt`.

El `RequestId` identifica la invocación concreta y la hora permite relacionarla con la acción hecha en la app.

## 14. Petición de extremo a extremo

Ejemplo: el usuario abre el detalle de `ZONE-07`, es decir, `GET /dev/zones/ZONE-07`.

1. La interfaz llama a `getZone('ZONE-07')` desde `App.tsx`.
2. `src/api.ts` concatena `API_URL` y `/zones/ZONE-07`, y ejecuta `fetch` con el método GET.
3. En local, Serverless Offline recibe la petición. En AWS, la recibe API Gateway por HTTPS.
4. La ruta declarada `/zones/{id}` asocia la petición a la función `getZone`. El valor dinámico `ZONE-07` llega en `event.pathParameters.id`.
5. El handler lee el identificador, busca la zona en el catálogo y construye una respuesta JSON.
6. Si existe, responde con HTTP 200 y la zona; si no, devuelve el error definido por el handler.
7. `api.ts` convierte el cuerpo de la respuesta y comprueba `response.ok`. Si hay un error HTTP, lanza una excepción.
8. `App.tsx` guarda la zona seleccionada y muestra el DETALLE; si falla, muestra el mensaje de error.
9. En AWS, la invocación de Lambda puede inspeccionarse en CloudWatch.


### Cómo llega `{id}` a `pathParameters`

`{id}` es un segmento variable de la ruta configurada en `serverless.yml`. Cuando se solicita `/zones/ZONE-07`, el enrutamiento asigna `ZONE-07` al parámetro `id` y lo entrega al handler dentro de `event.pathParameters`. El handler lo obtiene con `event.pathParameters.id`, sin analizar a mano la URL completa.

### Cómo llega el JSON a `event.body`

El cliente convierte el objeto en texto con `JSON.stringify` y envía la cabecera `Content-Type: application/json`. API Gateway entrega el contenido en `event.body` **como texto**. El backend debe convertirlo con `JSON.parse` (dentro de un `try/catch`, porque el texto puede no ser un JSON válido) y validar cada campo antes de usarlo.

## 15. Diagnóstico razonado de un supuesto

**Supuesto:** el listado carga en Expo Web, pero DETALLE devuelve 404.

No se trata de aplicar una receta, sino de razonar qué demuestra cada hecho y aislar la capa que falla.

1. **Qué prueba lo que funciona.** Que el listado cargue demuestra que la app alcanza la URL base y que el endpoint de colección (`/zones`) funciona. No prueba nada sobre la ruta con identificador.
2. **Observar la petición real.** En la pestaña Network del navegador se mira la URL exacta que se envía. Debe ser `/dev/zones/ZONE-07`, sin duplicar `/dev` y sin omitir el identificador.
3. **Repetir la misma petición fuera de la app.** Se prueba esa URL con `curl` o Thunder Client **contra el mismo entorno**. Esta comparación divide el problema en dos mitades.
4. **Si también falla fuera de la app,** el fallo está en el servidor: la ruta `/zones/{id}` en `serverless.yml`, un despliegue desactualizado o un identificador que no existe en el catálogo.
5. **Si fuera de la app funciona,** el fallo está en el cliente: cómo `getZone` construye la URL o cómo `App.tsx` interpreta la respuesta.
6. **Descartar confusiones.** Un error de CORS y un 404 son problemas distintos: el primero se ve como un bloqueo del navegador, con la petición sin respuesta legible; el segundo es una respuesta HTTP real.
7. **Tener en cuenta la limitación conocida.** Las escrituras simuladas no cambian el catálogo. Si un POST responde bien y la zona no aparece en un GET posterior, es la falta de persistencia, no un fallo de navegación.

### El método, aplicado a otros síntomas

El razonamiento es el mismo en cualquier caso: **definir qué se esperaba y qué ocurre, dividir el camino en capas y hacer una prueba que distinga entre dos hipótesis.**

| Síntoma | Hipótesis posibles | Prueba que las distingue |
|---|---|---|
| Todo falla con "Failed to fetch" en Expo Web, pero `curl` funciona | CORS, o la URL base | Ver en la consola del navegador si el error cita CORS; comparar la URL con la de `curl`. |
| La app va bien en el PC pero no en el móvil | `localhost` apunta al móvil; el servidor no escucha en la red | Abrir `http://<IP-del-PC>:3000/dev/zones` desde el navegador del móvil. |
| Responde 403 o "Missing Authentication Token" | Ruta o etapa mal escrita en la URL | Comparar la URL con la lista de endpoints de `serverless deploy`. |
| El POST devuelve éxito pero la zona no aparece al recargar | Falta de persistencia (escritura simulada) | Comprobar si un GET inmediato desde `curl` la devuelve. |
| La app muestra un error pero la API responde 200 | La respuesta no tiene la forma que valida `api.ts` | Ver el cuerpo real con `curl -i` y compararlo con el tipo `Zone`. |
| El DELETE parece fallar aunque se elimina | Respuesta sin cuerpo que el cliente intenta parsear como JSON | Ver si el código es 204 o el cuerpo está vacío. |

## 16. Decisiones técnicas

- **TypeScript** tipa los handlers y se compila a JavaScript antes de ejecutar, lo que detecta errores antes de llegar a AWS.
- **Serverless Framework** declara funciones y rutas en `serverless.yml`: la infraestructura queda descrita en un archivo versionable en lugar de configurada a mano en la consola.
- **Serverless Offline** permite probar localmente sin desplegar cada cambio, con un ciclo de prueba mucho más rápido.
- **Una función por operación** mantiene los handlers pequeños y permite ver en CloudWatch los logs de cada operación por separado.
- **Expo** facilita ejecutar la interfaz en el ordenador mediante web y en el móvil con Expo Go.
- **HTTP y JSON** establecen un contrato sencillo entre cliente y servidor.
- **Validación en el backend:** no se confía solo en la interfaz.
- **Escrituras simuladas y sin persistencia:** es una decisión del ejercicio. Una base de datos real quedaría fuera de su alcance, y por eso el README lo indica expresamente.
- **`API_URL` como único punto de cambio** entre local y AWS: un solo valor que modificar y comprobar.
- **Credenciales fuera del repositorio:** nunca en el código, en `serverless.yml` ni en archivos `.env` subidos.
- **CORS:** si la app en Expo Web (puerto 8081) llama a un backend en otro origen (puerto 3000, o AWS), el navegador exige cabeceras CORS. Si apareciera un bloqueo, se habilitaría `cors: true` en los eventos HTTP de `serverless.yml`.

## 17. Credenciales y seguridad

Ninguna Access Key, Secret Key ni Session Token debe estar en el repositorio. Las credenciales de AWS se configuran **fuera del proyecto**, con `aws configure` o con variables de entorno.

**Comprobaciones, desde la raíz del repositorio:**

```bash
git grep -nE "AKIA|ASIA|aws_secret_access_key|aws_session_token|AWS_SECRET|AWS_SESSION"
git ls-files | grep -iE '(^|/)\.env($|\.)|credentials|\.pem'
git log -p | grep -nE "AKIA|ASIA|aws_secret_access_key|aws_session_token"
```

Las tres órdenes deben **no devolver nada**. Las claves de acceso de AWS empiezan por `AKIA` (permanentes) o `ASIA` (temporales, como las de los laboratorios).

**`.gitignore` mínimo:**

```gitignore
node_modules/
.serverless/
.env
.env.*
.aws/
*.pem
```

> [!WARNING]
> Una búsqueda vacía en los archivos actuales no sustituye revisar el historial (la tercera orden). Si alguna vez se subió una clave, borrarla en un commit posterior **no la elimina del historial**: hay que **revocarla en AWS** y generar otra.

## 18. Matriz de evidencias

| Requisito | Evidencia | Estado |
|---|---|---|
| Repositorio con `backend/` y `mobile/` separados | Sección 3 | Cumplido |
| `serverless.yml` legible y coherente | `backend/serverless.yml` con seis funciones y rutas | Cumplido |
| `serverless-offline` con rutas | Salida de `npm start` con las seis rutas (sección 8) | Cumplido |
| Thunder Client: GET, POST, PUT, PATCH y DELETE | Colección de la sección 9.3 y `evidencias/local/` | Se cierra con las salidas reales |
| Al menos tres operaciones con `curl` | GET de lista, de detalle y de inexistente (sección 9.5); resto en `evidencias/local/` | Parcial: faltan las escrituras |
| App funcional contra backend local | Expo arrancó el bundle web (sección 10) | Parcial: falta registrar las operaciones |
| Endpoint AWS del despliegue | Sección 11 | Cumplido |
| Thunder y `curl` contra AWS | `evidencias/aws/` | Se cierra con las salidas reales |
| App consumiendo AWS | Sección 12, con el backend local apagado | Se cierra al probarlo |
| Logs de una invocación cloud desde la app | Sección 13 | Se cierra con los logs reales |
| README con arquitectura, ejecución, despliegue y decisiones | Este documento | Cumplido |
| Sin credenciales en el repositorio | Comandos de la sección 17 | Se cierra al ejecutarlos |

**Los cuatro pasos que cierran el checkpoint:**

1. `./scripts/probar-api.sh http://localhost:3000/dev evidencias/local`
2. `./scripts/probar-api.sh https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev evidencias/aws`
3. Usar la app contra AWS con el backend local apagado y guardar los logs de `npx serverless logs -f listZones`.
4. Ejecutar los comandos de la sección 17 y comprobar que no devuelven nada.

### Puedo explicar cómo una URL `{id}` llega a `pathParameters`

La ruta `/zones/{id}` declara `{id}` como segmento variable. Al pedir `/zones/ZONE-07`, el enrutamiento asigna `ZONE-07` al parámetro `id` y lo incluye en `event.pathParameters` del evento que recibe la función.

### Puedo explicar cómo el JSON llega a `event.body`

El cliente serializa el objeto con `JSON.stringify` y envía `Content-Type: application/json`. API Gateway pasa el cuerpo al handler **como texto** en `event.body`. El handler lo convierte con `JSON.parse` y valida los campos antes de usarlos.

### Sé qué crea `serverless deploy`

Empaqueta el código, lo sube a S3 y crea o actualiza un stack de CloudFormation con las seis funciones Lambda, la API de API Gateway con la etapa `dev`, los permisos de invocación, los grupos de logs de CloudWatch y el rol de ejecución. No es solo "una URL": es toda la infraestructura del servicio (sección 11).

### Sé por qué pruebo Thunder Client antes que React Native

Porque aísla las capas: si la API responde bien en un cliente genérico, un fallo posterior es de la app. Además, un cliente HTTP muestra el estado, las cabeceras y el cuerpo exactos y permite repetir la petición al instante (sección 9.1).

### Puedo cambiar local y cloud de forma controlada

Se modifica solo `API_URL` en `mobile/src/api.ts`, se recarga la app, se comprueba a dónde va la petición y, para demostrar AWS, se apaga el backend local (sección 8).

### Puedo demostrar cada requisito con una evidencia concreta

La matriz de la sección 18 asigna a cada requisito su evidencia y su estado, sin marcar como cumplido lo que todavía necesita una salida real.

### He revisado que no existen credenciales AWS en Git

Los comandos están en la sección 17. **Hay que ejecutarlos y comprobar que no devuelven nada** antes de marcar este punto.

### Explica una petición de extremo a extremo y diagnostica un supuesto sin depender de una receta

- **Extremo a extremo:** sección 14, con el recorrido completo de `GET /dev/zones/ZONE-07`, desde `App.tsx` hasta la pantalla, incluyendo `pathParameters` y `event.body`.
- **Diagnóstico:** sección 15. El método general consiste en definir lo esperado y lo observado, dividir el camino en capas (cliente, red, enrutamiento, handler, respuesta, interfaz) y hacer una prueba que distinga entre dos hipótesis, en vez de cambiar código al azar.

## 20. Estado del ejercicio y limitaciones


**Limitación principal:** el backend no tiene almacenamiento persistente y las escrituras son simuladas. Una respuesta correcta a un POST, PUT, PATCH o DELETE no garantiza que una consulta GET posterior devuelva los cambios. Una base de datos real (por ejemplo DynamoDB) sería la evolución natural del ejercicio.

## 21. Resumen

Venue Control traslada el patrón serverless de Festival Control a la gestión de zonas de un recinto. El backend en TypeScript ofrece seis rutas HTTP mediante Serverless Framework. Serverless Offline permitió comprobar en local el arranque y las invocaciones, y el despliegue confirmó la publicación en AWS de API Gateway y de las seis funciones Lambda. Expo Web arrancó en el ordenador.

La limitación principal es que las escrituras están simuladas y no hay almacenamiento persistente. Para cerrar el checkpoint basta con ejecutar el script de pruebas contra local y contra AWS, usar la app contra AWS con el backend local apagado, guardar los logs de una invocación y comprobar que el repositorio no contiene credenciales.