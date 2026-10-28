# Bloque 03

## Resultado

- Qué añadí al proyecto: He añadido la función `createEvent` para crear eventos mediante una petición POST. También he comprobado que puedo consultar el evento utilizando la función `getEvent`.
- Ruta o pantalla comprobada: He probado `POST http://localhost:3000/dev/events` para crear eventos y `GET http://localhost:3000/dev/events/EVT-NEW` para consultar uno.
- Estado y respuesta observados: La creación correcta devuelve `201 Created`, los datos incompletos devuelven `400 Bad Request` y el JSON inválido también devuelve `400 Bad Request`. La consulta del evento devuelve `200 OK`.

## Comprensión

- Recorrido del dato, explicado con mis palabras: En la petición POST envío los datos del evento en formato JSON. La función `createEvent` recibe los datos, comprueba que sean válidos y devuelve una respuesta. Después puedo utilizar el identificador del evento en una petición GET para consultarlo.

- Cambio guiado y resultado: He añadido `createEvent` al backend y he comprobado que aparece en las funciones disponibles de Serverless Offline. He probado una creación correcta, una petición con datos incompletos y otra con JSON inválido para comprobar las respuestas.

- Error encontrado y cómo lo resolví: Al principio escribí mal el comando de `curl` y apareció `bash: [200~curl: command not found`. Después ejecuté el comando correctamente y pude realizar las peticiones. También comprobé las respuestas de error cuando faltaban datos o el JSON no era válido.

## Evidencias

- Captura o transcripción breve, sin credenciales:

Comprobación de tipos y arranque:

```text
PS C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\backend> npm run typecheck

> backend@1.0.0 typecheck
> tsc --noEmit

PS C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\backend> npm run typecheck
>> npm start

> backend@1.0.0 typecheck
> tsc --noEmit


> backend@1.0.0 start
> npm run build && serverless offline


> backend@1.0.0 build
> tsc


Starting Offline at stage dev (us-east-1)

Offline [http for lambda] listening on http://localhost:3002
Function names exposed for local invocation by aws-sdk:
   * hello: festival-control-api-dev-hello
   * getEvent: festival-control-api-dev-getEvent
   * createEvent: festival-control-api-dev-createEvent

┌───────────────────────────────────────────────────────────┐
│                                                           │
│   GET  | http://localhost:3000/dev/hello                  │
│   POST | http://localhost:3000/2015-03-31/functions/hel   │
│   lo/invocations                                          │
│   GET  | http://localhost:3000/dev/events/{id}            │
│   POST | http://localhost:3000/2015-03-31/functions/get   │
│   Event/invocations                                       │
│   POST | http://localhost:3000/dev/events                 │
│   POST | http://localhost:3000/2015-03-31/functions/cre   │
│   ateEvent/invocations                                    │
│                                                           │
└───────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```

Logs de las peticiones:

```text
POST /dev/events (λ: createEvent)
POST evento: Nova Pulse
(λ: createEvent) RequestId: 9d1d31d9-aad0-4bbd-be2b-7c336233a4c7  Duration: 1179.35 ms  Billed Duration: 1180 ms


POST /dev/events (λ: createEvent)
(λ: createEvent) RequestId: 2609a5a2-6df5-48b6-812d-9adc7ed86da0  Duration: 3.37 ms  Billed Duration: 4 ms


POST /dev/events (λ: createEvent)
(λ: createEvent) RequestId: 37c19222-a0e3-4a6c-891d-781ed0eff624  Duration: 3.02 ms  Billed Duration: 4 ms


GET /dev/events/EVT-NEW (λ: getEvent)
GET evento: EVT-NEW
(λ: getEvent) RequestId: 22fe3d72-c529-462c-b25d-c0b51ec6f477  Duration: 177.88 ms  Billed Duration: 178 ms
```

Petición correcta de creación:

```text
josea@PCALE MINGW64 ~/Documents/GITHUB/DAM2 (git)/DOCUMENTOS/DISEÑO E IMPLEMENTACION CLOUD DEVOPS/1 TRIMESTRE/UNIDAD 1/04-PILARES-SERVERLESS (main)
$ curl -i -X POST http://localhost:3000/dev/events -H 'Content-Type: application/json' -d '{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}'
HTTP/1.1 201 Created
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 95
Date: Wed, 28 Oct 2026 07:09:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"EVT-NEW","artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}
```

Petición con datos incompletos:

```text
josea@PCALE MINGW64 ~/Documents/GITHUB/DAM2 (git)/DOCUMENTOS/DISEÑO E IMPLEMENTACION CLOUD DEVOPS/1 TRIMESTRE/UNIDAD 1/04-PILARES-SERVERLESS (main)
$ curl -i -X POST http://localhost:3000/dev/events -H 'Content-Type: application/json' -d '{"artist":"Nova Pulse"}'
HTTP/1.1 400 Bad Request
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 59
Date: Wed, 28 Oct 2026 07:09:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"artist, space y time (HH:mm) son obligatorios"}
```

Petición con JSON inválido:

```text
josea@PCALE MINGW64 ~/Documents/GITHUB/DAM2 (git)/DOCUMENTOS/DISEÑO E IMPLEMENTACION CLOUD DEVOPS/1 TRIMESTRE/UNIDAD 1/04-PILARES-SERVERLESS (main)
$ curl -i -X POST http://localhost:3000/dev/events -H 'Content-Type: application/json' -d '{'
HTTP/1.1 400 Bad Request
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 28
Date: Wed, 28 Oct 2026 07:10:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"JSON inválido"}
```

Consulta del evento:

```text
josea@PCALE MINGW64 ~/Documents/GITHUB/DAM2 (git)/DOCUMENTOS/DISEÑO E IMPLEMENTACION CLOUD DEVOPS/1 TRIMESTRE/UNIDAD 1/04-PILARES-SERVERLESS (main)
$ curl -i http://localhost:3000/dev/events/EVT-NEW
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 95
accept-ranges: bytes
Date: Wed, 28 Oct 2026 07:10:24 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"EVT-NEW","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}
```

- Limitaciones del ejercicio: He realizado las pruebas en local con Serverless Offline. He comprobado la creación, la validación de los datos y la consulta de un evento, pero no he probado un despliegue real en AWS.

