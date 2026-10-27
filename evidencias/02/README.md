# Bloque 02

## Resultado

- Qué añadí al proyecto: He añadido la función `getEvent` para consultar eventos mediante su identificador.
- Ruta o pantalla comprobada: He probado `GET http://localhost:3000/dev/events/{id}` con los identificadores `EVT-104`, `EVT-205`, `EVT-200` y `EVT-330`.
- Estado y respuesta observados: Serverless Offline reconoce la ruta y ejecuta la función `getEvent`. En la consola aparece el identificador de cada evento y los datos de ejecución.

## Comprensión

- Recorrido del dato, explicado con mis palabras: Cuando hago una petición GET, el identificador que pongo al final de la URL llega a la función `getEvent`. La función lo procesa y muestra en la consola el evento recibido.

- Cambio guiado y resultado: He añadido `getEvent` al backend. Al arrancar Serverless Offline aparece junto a `hello`, y he comprobado su funcionamiento utilizando distintos identificadores.

- Error encontrado y cómo lo resolví: Al principio apareció un error al cargar el módulo `getEvent`. Después volví a ejecutar la comprobación de tipos y arranqué de nuevo el servidor. A partir de ahí, las peticiones se ejecutaron correctamente.

## Evidencias

- Captura o transcripción breve, sin credenciales:

Comprobación de tipos y arranque del proyecto:

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

   ┌─────────────────────────────────────────────────────────────────────────┐
   │                                                                         │
   │   GET  | http://localhost:3000/dev/hello                                │
   │   POST | http://localhost:3000/2015-03-31/functions/hello/invocations   │
   │                                                                         │
   └─────────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```

Arranque con la función `getEvent`:

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

   ┌────────────────────────────────────────────────────────────────────────────┐
   │                                                                            │
   │   GET  | http://localhost:3000/dev/hello                                   │
   │   POST | http://localhost:3000/2015-03-31/functions/hello/invocations      │
   │   GET  | http://localhost:3000/dev/events/{id}                             │
   │   POST | http://localhost:3000/2015-03-31/functions/getEvent/invocations   │
   │                                                                            │
   └────────────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```

Error de la primera petición:

```text
GET /dev/events/EVT-104 (λ: getEvent)
✖ Unhandled exception in handler 'getEvent'.
✖ Runtime.ImportModuleError: Error: Cannot find module 'C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\backend\dist\getEvent.ts'
Require stack:
- C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\backend\node_modules\tsx\dist\register-B1c7OH6V.cjs
- C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\backend\node_modules\tsx\dist\cjs\api\index.cjs
- C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\backend\node_modules\serverless-offline\src\lambda\handler-runner\in-process-runner\aws-lambda-ric\UserFunction.js:275:13)
```

Peticiones realizadas después de reiniciar el servidor:

```text
GET /dev/events/EVT-104 (λ: getEvent)
GET evento: EVT-104
(λ: getEvent) RequestId: f5d95fd3-8913-47d2-9589-5dcf805d47c9  Duration: 155.33 ms  Billed Duration: 156 ms


GET /dev/events/EVT-205 (λ: getEvent)
GET evento: EVT-205
(λ: getEvent) RequestId: c0eaf4fb-e577-403d-b5e5-414994a75349  Duration: 150.13 ms  Billed Duration: 151 ms


GET /dev/events/EVT-200 (λ: getEvent)
GET evento: EVT-200
(λ: getEvent) RequestId: e1e4ff2f-e91f-42f6-881f-b1ea3e044ae5  Duration: 148.71 ms  Billed Duration: 149 ms


GET /dev/events/EVT-330 (λ: getEvent)
GET evento: EVT-330
(λ: getEvent) RequestId: 2f71b89f-3c7b-418d-a1f1-6532393a9bc5  Duration: 148.71 ms  Billed Duration: 149 ms


GET /dev/events/EVT-330 (λ: getEvent)
GET evento: EVT-330
(λ: getEvent) RequestId: ee325ca8-7b67-451d-b5e5-414994a75349  Duration: 155.07 ms  Billed Duration: 156 ms
```

- Limitaciones del ejercicio: He realizado las pruebas en local con Serverless Offline. No he comprobado un despliegue real en AWS.