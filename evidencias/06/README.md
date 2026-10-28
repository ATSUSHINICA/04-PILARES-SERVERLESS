# Bloque 06

## Resultado

- Qué añadí al proyecto: He comprobado el funcionamiento conjunto del backend `festival-control-api` y la aplicación móvil `festival-control-mobile`, utilizando Serverless Offline y Expo Web.
- Ruta o pantalla comprobada: He probado el backend en `http://localhost:3000`, la aplicación web en `http://localhost:8081` y la ruta `GET /dev/events`, que utiliza la función `listEvents`.
- Estado y respuesta observados: El backend compila con TypeScript y arranca correctamente. Serverless Offline registra las funciones `hello`, `getEvent`, `createEvent`, `listEvents`, `replaceEvent`, `updateEvent` y `deleteEvent`. La aplicación móvil supera la comprobación de tipos y Expo Web termina de generar el paquete de la aplicación.

## Comprensión

- Recorrido del dato, explicado con mis palabras: La aplicación móvil utiliza `api.ts` para solicitar los eventos al backend mediante una petición HTTP. La petición llega a `http://localhost:3000/dev/events`, Serverless Offline la dirige a `listEvents` y la función procesa la solicitud. La respuesta se utiliza para mostrar los eventos en la interfaz. Desde Network puedo comprobar el método, la URL, el código HTTP y el contenido de la respuesta.

- Cambio guiado y resultado: La práctica consiste en cambiar temporalmente `/events` por `/ruta-inexistente` dentro de `getEvents`, en `api.ts`. Con el backend activo, debo recargar la aplicación y comprobar en Network que la ruta incorrecta devuelve una respuesta HTTP de error. Después debo restaurar `/events` y verificar que la petición devuelve `200 OK` y aparecen las dos tarjetas. La ruta correcta debe quedar restaurada antes de continuar.

- Error encontrado y cómo lo resolví: Al iniciar Expo aparece el mensaje `Networking has been disabled` y se indica que la validación de dependencias no es fiable en modo sin conexión. A pesar de ello, `npm run typecheck` termina sin errores, Metro Bundler arranca y la aplicación web se genera correctamente. No se han mostrado errores de compilación en las transcripciones facilitadas.

## Evidencias

- Captura o transcripción breve, sin credenciales:

Arranque del backend desde PowerShell:

```text
PS C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS> cd backend

PS C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\backend> npm start

> backend@1.0.0 start
> npm run build && serverless offline

> backend@1.0.0 build
> tsc

Starting Offline at stage dev (us-east-1)

Offline [http for lambda] listening on http://localhost:3002
```

Funciones registradas por Serverless Offline:

```text
hello: festival-control-api-dev-hello
getEvent: festival-control-api-dev-getEvent
createEvent: festival-control-api-dev-createEvent
listEvents: festival-control-api-dev-listEvents
replaceEvent: festival-control-api-dev-replaceEvent
updateEvent: festival-control-api-dev-updateEvent
deleteEvent: festival-control-api-dev-deleteEvent
```

Rutas HTTP registradas:

```text
GET    http://localhost:3000/dev/hello
GET    http://localhost:3000/dev/events/{id}
POST   http://localhost:3000/dev/events
GET    http://localhost:3000/dev/events
PUT    http://localhost:3000/dev/events/{id}
PATCH  http://localhost:3000/dev/events/{id}
DELETE http://localhost:3000/dev/events/{id}
```

El servidor confirma que está preparado:

```text
Server ready: http://localhost:3000 🚀
```

Peticiones recibidas por el backend:

```text
GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: b2b3eb33-b803-4a25-a0ad-ea93019c4bae  Duration: 1268.46 ms  Billed Duration: 1269 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: f188e61b-4ed7-4353-b89d-cf03da1cbf6f  Duration: 219.12 ms  Billed Duration: 220 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 8ce1ad97-fefd-443e-a983-37dfc17a12b1  Duration: 270.64 ms  Billed Duration: 271 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: af053001-64cb-4662-a240-5b7b73037bc3  Duration: 243.20 ms  Billed Duration: 244 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 5180087a-13d0-429e-bb3c-5a76a39ec7a9  Duration: 9.70 ms  Billed Duration: 10 ms
```

Estas peticiones muestran que `listEvents` ha recibido y procesado varias solicitudes GET. En la consola aparecen sus identificadores de ejecución y duraciones.

Comprobación de tipos de la aplicación móvil desde Git Bash:

```text
josea@PCALE MINGW64 ~/Documents/GITHUB/DAM2 (git)/DOCUMENTOS/DISEÑO E IMPLEMENTACION CLOUD DEVOPS/1 TRIMESTRE/UNIDAD 1/04-PILARES-SERVERLESS/mobile (main)
$ npm run typecheck

> festival-control-mobile@1.0.0 typecheck
> tsc --noEmit
```

El comando finaliza sin mostrar errores de TypeScript.

Arranque de Expo Web:

```text
$ npm run typecheck
npm run web

> festival-control-mobile@1.0.0 typecheck
> tsc --noEmit

> festival-control-mobile@1.0.0 web
> expo start --web

Starting project at C:\Users\josea\Documents\GITHUB\DAM2 (git)\DOCUMENTOS\DISEÑO E IMPLEMENTACION CLOUD DEVOPS\1 TRIMESTRE\UNIDAD 1\04-PILARES-SERVERLESS\mobile
Starting Metro Bundler
Networking has been disabled
Dependency validation is unreliable in offline-mode
```

Direcciones de acceso y resultado de la compilación:

```text
› Metro waiting on exp://172.22.28.50:8081
› Web is waiting on http://localhost:8081
› Using Expo Go

Logs for your project will appear below. Press Ctrl+C to exit.

Web Bundled 3074ms node_modules\expo\AppEntry.js (180 modules)
 LOG  [web] Logs will appear in the browser console
Web Bundled 36ms node_modules\expo\AppEntry.js (1 module)
 LOG  [web] Logs will appear in the browser console
Web Bundled 33ms node_modules\expo\AppEntry.js (1 module)
 LOG  [web] Logs will appear in the browser console
Web Bundled 35ms node_modules\expo\AppEntry.js (1 module)
 LOG  [web] Logs will appear in the browser console
```

- Limitaciones del ejercicio: Las comprobaciones se han realizado en local con Serverless Offline y Expo Web. No se ha realizado un despliegue en AWS. La consola del backend registra varias peticiones a `/dev/events`, pero las transcripciones no muestran el código HTTP ni el contenido de la respuesta en Network. Tampoco incluyen la prueba con `/ruta-inexistente`. Es necesario comprobar esos dos resultados en el navegador antes de afirmar que se ha completado esa parte de la práctica. Expo también advierte de que la validación de dependencias es poco fiable en modo sin conexión.