# Festival Control · Bloque 01

## Qué he construido
He trabajado con una función `hello` en TypeScript que devuelve un mensaje en formato JSON. La he probado en local mediante la ruta `GET http://localhost:3000/dev/hello`, utilizando Serverless Offline para simular el funcionamiento de AWS Lambda sin tener que desplegarlo en AWS.

## Qué he comprendido
He comprendido que `APIGatewayProxyEvent` representa los datos de la petición que recibe la función y que `APIGatewayProxyResult` define la estructura de la respuesta que devuelve. También he aprendido que `tsc` compila el código TypeScript de `src/hello.ts` a JavaScript en `dist/hello.js`, que es el archivo que se utiliza para ejecutar el handler. El mensaje `EVENT RECIBIDO` aparece en la consola cuando se ejecuta el `console.log` de la función al recibir una petición.

## Qué he modificado
He cambiado el valor de `message` por `Festival Control · equipo preparado` y he añadido la propiedad `service: "hello"` al JSON devuelto. No he modificado `serverless.yml` porque quería conservar la misma ruta, el método GET y el handler. De esta manera, solo cambia el contenido de la respuesta, manteniendo el estado HTTP 200.

## Cómo lo he comprobado
He ejecutado `npm run typecheck` para comprobar los tipos y `npm start` para recompilar y arrancar Serverless Offline. Después, he probado la misma URL en Thunder y con curl. La respuesta de curl ha sido `HTTP/1.1 200 OK` y ha devuelto correctamente el JSON con el nuevo mensaje y la propiedad `service`. También he comprobado que aparece un nuevo log en la consola al realizar la petición.

## Evidencias
**Evidencia propia:** adjunto una captura de mi terminal con la petición de curl, el estado HTTP 200 y el JSON devuelto. También incluiré una captura de Thunder y del log de Serverless Offline.
Offline [http for lambda] listening on http://localhost:3002
Offline [http for websocket] listening on ws://localhost:3001
Offline [http for proxy] listening on http://localhost:3000

GET /dev/hello (λ: hello)
EVENT RECIBIDO
josea@PCALE MINGW64 ~/Documents/GITHUB/DAM2 (git)/DOCUMENTOS/DISEÑO E IMPLEMENTACION CLOUD DEVOPS/1 TRIMESTRE/UNIDAD 1/04-PILARES-SERVERLESS
$ curl -i http://localhost:3000/dev/hello
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
cache-control: no-cache
content-length: 68
accept-ranges: bytes
Date: Tue, 27 Oct 2026 21:27:17 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Festival Control · equipo preparado","service":"hello"}

josea@PCALE MINGW64 ~/Documents/GITHUB/DAM2 (git)/DOCUMENTOS/DISEÑO E IMPLEMENTACION CLOUD DEVOPS/1 TRIMESTRE/UNIDAD 1/04-PILARES-SERVERLESS
$