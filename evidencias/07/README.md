# Bloque 07

## Resultado
- Qué añadí al proyecto: He continuado comprobando la comunicación entre el frontend desarrollado con Expo y el backend desarrollado con TypeScript y Serverless Offline. He probado las operaciones GET, POST, PUT, PATCH y DELETE sobre los eventos. En el frontend intervienen `mobile/App.tsx`, `mobile/src/api.ts` y `mobile/src/types.ts`. En el backend, las rutas están definidas en `backend/serverless.yml` y las operaciones se encuentran en `backend/src/events/list.ts`, `backend/src/events/create.ts`, `backend/src/events/replace.ts`, `backend/src/events/update.ts` y `backend/src/events/delete.ts`.
- Ruta o pantalla comprobada: He iniciado el backend en `http://localhost:3000` y la aplicación web de Expo en `http://localhost:8081`. He comprobado las peticiones a `GET /dev/events`, `POST /dev/events`, `PUT /dev/events/EVT-101`, `PATCH /dev/events/EVT-101` y `DELETE /dev/events/EVT-102`.
- Estado y respuesta observados: El backend ha registrado las operaciones y ha ejecutado las funciones correspondientes. También he comprobado que las peticiones PATCH pueden enviar el estado `CONFIRMED` o `CANCELLED`. El comando `npm run typecheck` termina sin errores. Los registros del backend confirman la ejecución de las operaciones, aunque no muestran por sí solos los códigos HTTP ni el contenido de todas las respuestas.

## Comprensión
- Recorrido del dato, explicado con mis palabras: La interfaz de `mobile/App.tsx` utiliza las llamadas definidas en `mobile/src/api.ts` para enviar peticiones HTTP. El backend recibe las peticiones mediante las rutas configuradas en `backend/serverless.yml` y ejecuta la función correspondiente. Por ejemplo, `GET /dev/events` utiliza `backend/src/events/list.ts`, mientras que `PATCH /dev/events/EVT-101` utiliza `backend/src/events/update.ts`. Las funciones procesan los datos y devuelven respuestas al frontend. El modelo y los datos de prueba se encuentran en `backend/src/events/model.ts`. En este ejercicio he comprobado la ejecución de las operaciones y la diferencia entre devolver una respuesta de actualización o eliminación y persistir realmente los cambios.
- Cambio guiado y resultado: He probado el cambio del estado solicitado mediante PATCH, modificando temporalmente `status` de `CANCELLED` a `CONFIRMED`. La comprobación esperada consiste en recibir un estado HTTP 200 y una respuesta con `changes.status: "CONFIRMED"`. Después he restaurado `CANCELLED`, tal como indicaba el cuaderno. Los registros muestran dos ejecuciones de `updateEvent` asociadas a estas pruebas y peticiones GET posteriores. También he ejecutado DELETE sobre `EVT-102` y he vuelto a consultar los eventos para comprobar el comportamiento de los datos después de las operaciones.
- Error encontrado y cómo lo resolví: En el primer intento de iniciar el backend, Serverless mostró un error de conexión con su API porque no pudo resolver `core.serverless.com`. Volví a ejecutar `npm start` y el backend arrancó correctamente con Serverless Offline. En el frontend, `npm run typecheck` terminó sin errores y Expo inició Metro y compiló la aplicación web.

## Evidencias
- Captura o transcripción breve, sin credenciales:

Inicio del backend y compilación:

```text
PS ...\04-PILARES-SERVERLESS> cd backend
PS ...\04-PILARES-SERVERLESS\backend> npm start

> backend@1.0.0 start
> npm run build && serverless offline

> backend@1.0.0 build
> tsc

✖ Unable to reach the Serverless API (fetch failed; getaddrinfo ENOTFOUND core.serverless.com; code: ENOTFOUND).
Please verify your network connection and try again.
```

Segundo intento e inicio correcto:

```text
PS ...\04-PILARES-SERVERLESS\backend> npm start

> backend@1.0.0 start
> npm run build && serverless offline

> backend@1.0.0 build
> tsc

Starting Offline at stage dev (us-east-1)

Offline [http for lambda] listening on http://localhost:3002
```

Funciones registradas:

```text
Function names exposed for local invocation by aws-sdk:
   * hello: festival-control-api-dev-hello
   * getEvent: festival-control-api-dev-getEvent
   * createEvent: festival-control-api-dev-createEvent
   * listEvents: festival-control-api-dev-listEvents
   * replaceEvent: festival-control-api-dev-replaceEvent
   * updateEvent: festival-control-api-dev-updateEvent
   * deleteEvent: festival-control-api-dev-deleteEvent
```

Rutas registradas por Serverless Offline:

```text
GET    http://localhost:3000/dev/hello
GET    http://localhost:3000/dev/events/{id}
POST   http://localhost:3000/dev/events
GET    http://localhost:3000/dev/events
PUT    http://localhost:3000/dev/events/{id}
PATCH  http://localhost:3000/dev/events/{id}
DELETE http://localhost:3000/dev/events/{id}
```

Peticiones GET y POST:

```text
GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 2bd40cd8-66e8-4170-9ae7-661b1fea729b  Duration: 245.51 ms  Billed Duration: 246 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 77521427-3fc2-4235-b9b9-8870f8cd4100  Duration: 246.15 ms  Billed Duration: 247 ms

POST /dev/events (λ: createEvent)
POST evento: Nova Pulse
(λ: createEvent) RequestId: 90cc02ad-9f82-449e-9a67-217bdc75b1bf  Duration: 219.60 ms  Billed Duration: 220 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 7da59fcc-e393-4b81-9c6f-db885590db81  Duration: 230.91 ms  Billed Duration: 231 ms
```

Peticiones PUT, PATCH y DELETE:

```text
PUT /dev/events/EVT-101 (λ: replaceEvent)
PUT evento: EVT-101
(λ: replaceEvent) RequestId: 92117bd4-bede-485d-bd6b-d195610dbc29  Duration: 210.11 ms  Billed Duration: 211 ms

PATCH /dev/events/EVT-101 (λ: updateEvent)
PATCH evento: EVT-101
(λ: updateEvent) RequestId: 071829fe-72a5-4a17-8262-8ddf98b88c26  Duration: 206.15 ms  Billed Duration: 207 ms

DELETE /dev/events/EVT-102 (λ: deleteEvent)
DELETE evento: EVT-102
(λ: deleteEvent) RequestId: 58852bc6-7b2f-4407-bad7-01f6c5136154  Duration: 229.30 ms  Billed Duration: 230 ms
```

Consultas GET posteriores:

```text
GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 8fee7098-7100-4206-9b56-c39ffb8585dd  Duration: 241.75 ms  Billed Duration: 242 ms

DELETE /dev/events/EVT-102 (λ: deleteEvent)
DELETE evento: EVT-102
(λ: deleteEvent) RequestId: 197baf2f-c653-4bd9-801d-624cd1118337  Duration: 223.10 ms  Billed Duration: 224 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 425ce6d4-ae09-4ee1-b3c7-e502c47eafb3  Duration: 3.82 ms  Billed Duration: 4 ms
```

Más pruebas PATCH y GET:

```text
DELETE /dev/events/EVT-102 (λ: deleteEvent)
DELETE evento: EVT-102
(λ: deleteEvent) RequestId: 33b7aa97-8934-4ce2-abab-21db490ef9ed  Duration: 209.51 ms  Billed Duration: 210 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 88f303e4-a82e-44d0-beab-3c5dde5344f3  Duration: 239.31 ms  Billed Duration: 240 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 1058a3fd-c33c-411e-a05f-ecc633d9c0bc  Duration: 3.83 ms  Billed Duration: 4 ms

PATCH /dev/events/EVT-101 (λ: updateEvent)
PATCH evento: EVT-101
(λ: updateEvent) RequestId: f7c3be20-a616-4797-a69f-ff9d2899a1af  Duration: 229.40 ms  Billed Duration: 230 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: f4288db8-a705-4719-9dcc-9f791992f566  Duration: 192.17 ms  Billed Duration: 193 ms

PATCH /dev/events/EVT-101 (λ: updateEvent)
PATCH evento: EVT-101
(λ: updateEvent) RequestId: 37c6fa08-068a-44aa-aa1b-d940929beae4  Duration: 224.18 ms  Billed Duration: 225 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: cec242ff-82fa-4595-b022-a0a75c2b51ce  Duration: 3.58 ms  Billed Duration: 4 ms
```

Comprobación de TypeScript desde `mobile/`:

```text
$ npm run typecheck

> festival-control-mobile@1.0.0 typecheck
> tsc --noEmit
```

Inicio de Expo para web:

```text
$ npm run web

> festival-control-mobile@1.0.0 web
> expo start --web

Starting project at C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\mobile
Starting Metro Bundler

› Metro waiting on exp://172.22.28.50:8081
› Web is waiting on http://localhost:8081

› Using Expo Go
› Press s │ switch to development build
› Press a │ open Android
› Press w │ open web
› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
Web Bundled 3037ms node_modules\expo\AppEntry.js (160 modules)
LOG  [web] Logs will appear in the browser console
Web Bundled 33ms node_modules\expo\AppEntry.js (1 module)
LOG  [web] Logs will appear in the browser console
Web Bundled 76ms node_modules\expo\AppEntry.js (1 module)
LOG  [web] Logs will appear in the browser console
```

- Limitaciones del ejercicio: Las pruebas se han realizado en local con Serverless Offline y Expo; no demuestran un despliegue en AWS. Los registros muestran que las funciones reciben las peticiones, pero no incluyen todas las respuestas HTTP ni el cuerpo de cada GET, por lo que no permiten confirmar por sí solos el contenido final de los eventos. Las operaciones actuales tampoco demuestran persistencia real en una base de datos. El error inicial de conexión con `core.serverless.com` se resolvió al volver a ejecutar `npm start` correctamente.