# Bloque 04

## Resultado

- Qué añadí al proyecto: He comprobado las operaciones de consulta, creación, sustitución, actualización parcial y eliminación de eventos mediante la API.
- Ruta o pantalla comprobada: He probado `GET /dev/events`, `GET /dev/events/{id}`, `POST /dev/events`, `PUT /dev/events/{id}`, `PATCH /dev/events/{id}` y `DELETE /dev/events/{id}`.
- Estado y respuesta observados: La consulta de eventos devuelve `200 OK`, la creación devuelve `201 Created` y la consulta de un evento inexistente devuelve `404 Not Found`. También he comprobado que las peticiones con datos incorrectos devuelven `400 Bad Request`.

## Comprensión

- Recorrido del dato, explicado con mis palabras: Cuando envío una petición HTTP, Serverless Offline dirige la petición a la función correspondiente. La función procesa los datos recibidos, realiza las validaciones y devuelve una respuesta con el código HTTP y el resultado de la operación.

- Cambio guiado y resultado: He comprobado la diferencia entre PUT y PATCH enviando únicamente `{"status":"CANCELLED"}`. PUT devuelve `400 Bad Request` porque necesita los campos obligatorios del evento completo. PATCH acepta el cambio y devuelve `200 OK` con `operation: UPDATED`. Sin embargo, al consultar después el evento, su estado continúa siendo `CONFIRMED`.

- Error encontrado y cómo lo resolví: He probado peticiones con datos incompletos o campos no permitidos. PUT rechaza los datos parciales y PATCH rechaza los campos distintos de `status`. Al enviar únicamente el estado `CANCELLED` mediante PATCH, la petición devuelve `200 OK`.

## Evidencias

- Captura o transcripción breve, sin credenciales:

Comprobación de tipos y arranque del proyecto:

```text
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
   * listEvents: festival-control-api-dev-listEvents
   * replaceEvent: festival-control-api-dev-replaceEvent
   * updateEvent: festival-control-api-dev-updateEvent
   * deleteEvent: festival-control-api-dev-deleteEvent

Server ready: http://localhost:3000 🚀
```

Consulta de eventos:

```bash
curl -i http://localhost:3000/dev/events
curl -i http://localhost:3000/dev/events/EVT-101
curl -i http://localhost:3000/dev/events/NO-EXISTE
```

Resultados observados:

```text
GET /dev/events → 200 OK
GET /dev/events/EVT-101 → 200 OK
GET /dev/events/NO-EXISTE → 404 Not Found
```

La consulta general devuelve los eventos `EVT-101` y `EVT-102`. La consulta individual de `EVT-101` devuelve el evento con el estado `CONFIRMED`. Para un identificador inexistente, la respuesta es:

```json
{
  "message": "Evento no encontrado"
}
```

Creación y sustitución de eventos:

```bash
curl -i -X POST http://localhost:3000/dev/events -H 'Content-Type: application/json' -d '{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}'

curl -i -X PUT http://localhost:3000/dev/events/EVT-101 -H 'Content-Type: application/json' -d '{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}'
```

Resultados observados:

```text
POST /dev/events → 201 Created
PUT /dev/events/EVT-101 → 200 OK
```

La creación devuelve el identificador `EVT-NEW`. La sustitución devuelve el evento actualizado con `operation: REPLACED`.

Actualización parcial y eliminación:

```bash
curl -i -X PATCH http://localhost:3000/dev/events/EVT-101 -H 'Content-Type: application/json' -d '{"status":"CANCELLED"}'

curl -i -X DELETE http://localhost:3000/dev/events/EVT-102
```

Resultados observados:

```text
PATCH /dev/events/EVT-101 → 200 OK
DELETE /dev/events/EVT-102 → 200 OK
```

La respuesta de PATCH incluye `operation: UPDATED` y la de DELETE incluye `operation: DELETED`.

Validación de PUT y PATCH:

```bash
curl -i -X PUT http://localhost:3000/dev/events/EVT-101 -H 'Content-Type: application/json' -d '{"status":"CANCELLED"}'

curl -i -X PATCH http://localhost:3000/dev/events/EVT-101 -H 'Content-Type: application/json' -d '{"time":"22:00"}'

curl -i -X PATCH http://localhost:3000/dev/events/EVT-101 -H 'Content-Type: application/json' -d '{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CANCELLED"}'
```

Resultados observados:

```text
PUT con datos parciales → 400 Bad Request
PATCH con el campo time → 400 Bad Request
PATCH con todos los campos del evento → 400 Bad Request
```

Los mensajes de error obtenidos fueron:

```json
{"message":"PUT requiere artist, space, time HH:mm y status válido"}
```

```json
{"message":"PATCH admite únicamente status CONFIRMED o CANCELLED"}
```

Comprobación de CORS:

```bash
curl -i -X OPTIONS http://localhost:3000/dev/events -H 'Origin: http://localhost:8081' -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: content-type'
```

La petición devuelve `200 OK` e incluye cabeceras CORS que permiten el origen `http://localhost:8081` y el método `POST`.

Comprobación final de PUT frente a PATCH:

```bash
curl -i -X PUT http://localhost:3000/dev/events/EVT-101 -H 'Content-Type: application/json' -d '{"status":"CANCELLED"}'

curl -i -X PATCH http://localhost:3000/dev/events/EVT-101 -H 'Content-Type: application/json' -d '{"status":"CANCELLED"}'

curl -i http://localhost:3000/dev/events/EVT-101
```

Resultados observados:

```text
PUT parcial → 400 Bad Request
PATCH de status → 200 OK
GET posterior → 200 OK
```

La consulta posterior sigue devolviendo `EVT-101` con el estado `CONFIRMED`, aunque PATCH haya respondido con `operation: UPDATED`.

- Limitaciones del ejercicio: He realizado las pruebas en local con Serverless Offline. No he comprobado un despliegue real en AWS. La respuesta de PATCH indica que la operación se ha aceptado, pero el GET posterior sigue mostrando el estado anterior. Por tanto, no puedo confirmar que el cambio se conserve en los datos consultados. No he añadido persistencia ni he desactivado las validaciones.