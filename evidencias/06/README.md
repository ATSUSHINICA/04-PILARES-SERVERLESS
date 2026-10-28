# Bloque 06

## Resultado
- Qué añadí al proyecto: He comprobado la comunicación local entre el frontend de `mobile/` y el backend de `backend/`. He utilizado `mobile/src/api.ts` para las peticiones, `mobile/App.tsx` para la interfaz y `backend/src/events/list.ts` para atender las peticiones de listado. Las rutas están definidas en `backend/serverless.yml`.
- Ruta o pantalla comprobada: He iniciado el backend en `http://localhost:3000` y la aplicación web de Expo en `http://localhost:8081`. La ruta comprobada en los registros del backend es `GET /dev/events`.
- Estado y respuesta observados: `npm run typecheck` termina sin errores y Expo compila la aplicación. En la consola del backend aparecen varias peticiones `GET /dev/events` atendidas por `listEvents`.

## Comprensión
- Recorrido del dato, explicado con mis palabras: `mobile/App.tsx` utiliza las funciones de `mobile/src/api.ts` para solicitar los eventos. La petición `GET /dev/events` está asociada a `listEvents`, implementada en `backend/src/events/list.ts` y registrada en `backend/serverless.yml`. Los tipos utilizados en el frontend están definidos en `mobile/src/types.ts`. El backend se compila mediante el script de `backend/package.json`, utilizando la configuración de `backend/tsconfig.json`, y genera los archivos JavaScript en `backend/dist/`. El resto de funciones del backend se encuentran en `backend/src/hello.ts` y en `backend/src/events/get.ts`, `create.ts`, `replace.ts`, `update.ts`, `delete.ts` y `model.ts`.
- Cambio guiado y resultado: La prueba consiste en cambiar temporalmente `/events` por `/ruta-inexistente` en `mobile/src/api.ts`, mantener el backend activo y observar la petición en Network. Después hay que restaurar `/events` y comprobar que la petición vuelve a funcionar. Los registros aportados confirman las peticiones a `GET /dev/events`, pero no incluyen el estado HTTP de la ruta incorrecta.
- Error encontrado y cómo lo resolví: Al iniciar Expo aparecen los avisos `Networking has been disabled` y `Dependency validation is unreliable in offline-mode`. A pesar de estos avisos, `npm run typecheck` finaliza sin errores y Metro completa la compilación de la aplicación. La consola no muestra un error de compilación de TypeScript.

## Evidencias
- Captura o transcripción breve, sin credenciales:

Inicio del backend desde `backend/`:

```text
PS ...\04-PILARES-SERVERLESS> cd backend
PS ...\backend> npm start

> backend@1.0.0 start
> npm run build && serverless offline

> backend@1.0.0 build
> tsc

Starting Offline at stage dev (us-east-1)

Offline [http for lambda] listening on http://localhost:3002
```

Funciones locales registradas:

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

Rutas registradas:

```text
GET    http://localhost:3000/dev/hello
GET    http://localhost:3000/dev/events/{id}
POST   http://localhost:3000/dev/events
GET    http://localhost:3000/dev/events
PUT    http://localhost:3000/dev/events/{id}
PATCH  http://localhost:3000/dev/events/{id}
DELETE http://localhost:3000/dev/events/{id}
```

Peticiones de listado registradas por el backend:

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

Tras volver a iniciar el backend, se registraron estas peticiones adicionales:

```text
GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: b17032cb-3d54-4692-9cb7-aab4ee27fa74  Duration: 215.99 ms Billed Duration: 216 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: a510b580-dd48-4878-849d-4dba3a68433e Duration: 4.87 ms Billed Duration: 5 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: ffad343e-47dc-4ff4-8bf0-22b6188e464c Duration: 5.69 ms Billed Duration: 6 ms

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 48eec287-ed94-4ca7-8a2a-c0da42c295f1 Duration: 5.08 ms Billed Duration: 6 ms
```

Comprobación de TypeScript desde `mobile/`:

```text
$ cd mobile
$ npm run typecheck

> festival-control-mobile@1.0.0 typecheck
> tsc --noEmit
```

Inicio de Expo para web:

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
...
› Metro waiting on exp://172.22.28.50:8081
› Web is waiting on http://localhost:8081
› Using Expo Go
...
Logs for your project will appear below. Press Ctrl+C to exit.
Web Bundled 3074ms node_modules\expo\AppEntry.js (180 modules)
Web Bundled 36ms node_modules\expo\AppEntry.js (1 module)
Web Bundled 33ms node_modules\expo\AppEntry.js (1 module)
Web Bundled 35ms node_modules\expo\AppEntry.js (1 module)
```

- Limitaciones del ejercicio: La comprobación se ha realizado en local con Serverless Offline y Expo. Los registros confirman que el backend recibe peticiones a `GET /dev/events`, pero no incluyen la respuesta HTTP de `/ruta-inexistente`. Para documentar esa parte como comprobada, falta registrar el estado HTTP en Network con la ruta temporal incorrecta y después con `/events` restaurada. La ruta definitiva de `mobile/src/api.ts` debe permanecer en `/events`.