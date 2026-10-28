# Bloque 08 — Despliegue y comprobación en AWS

## Resultado

- **Qué añadí al proyecto:** desplegué y comprobé el backend de Festival Control en AWS mediante Serverless Framework. Verifiqué los endpoints de listado y consulta individual de eventos, junto con los registros generados por las funciones Lambda.
- **Ruta o pantalla comprobada:** API Gateway, stage `dev`, endpoints `GET /events` y `GET /events/{id}`. También consulté los logs de las funciones `listEvents` y `getEvent` en AWS CloudWatch.
- **Estado y respuesta observados:**
  - `GET /events`: `200 OK`. Devuelve los eventos `EVT-101` y `EVT-102`.
  - `GET /events/EVT-101`: `200 OK`. Devuelve el evento Neon Waves, en Main Stage, a las 22:30, con estado `CONFIRMED`.
  - `GET /events/NO-EXISTE`: `404 Not Found`. Devuelve el mensaje `{"message":"Evento no encontrado"}`.

## Comprensión

- **Recorrido del dato, explicado con mis palabras:** envío una petición HTTP a la URL de API Gateway. API Gateway dirige la petición a la función Lambda correspondiente según el método HTTP y la ruta. La función recibe los datos de la petición, ejecuta la lógica del endpoint y devuelve una respuesta HTTP con su código de estado y un cuerpo JSON. Los logs de CloudWatch permiten comprobar qué función se ha ejecutado y qué identificador ha recibido.

- **Cambio guiado y resultado:** utilicé la URL real de la API desplegada y guardé su base en la variable `API_BASE` desde Git Bash. Después ejecuté las peticiones con `curl` y consulté los logs de las funciones desplegadas. El listado devolvió los dos eventos del catálogo y la consulta individual permitió distinguir entre un evento existente y otro inexistente.

- **Error encontrado y cómo lo resolví:** al principio, el comando `read` falló porque se pegó en la terminal con el prefijo accidental `[200~`. Como la variable `API_BASE` no llegó a establecerse, la petición posterior con `curl` también falló por tener una URL vacía o no válida. Lo resolví entrando en la carpeta `backend` y ejecutando de nuevo `read -r -p` sin el prefijo accidental. Después, `curl` funcionó correctamente. También escribí por error la palabra `Consulta` delante de un comando de terminal; lo solucioné ejecutando únicamente el comando válido.

## Evidencias

- **Captura o transcripción breve, sin credenciales:**

  ```text
  GET /events
  HTTP/1.1 200 OK

  [{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"},
   {"id":"EVT-102","artist":"Midnight Session","space":"Club Stage","time":"23:45","status":"CONFIRMED"}]
  ```

  ```text
  GET /events/EVT-101
  HTTP/1.1 200 OK

  {"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}
  ```

  ```text
  GET /events/NO-EXISTE
  HTTP/1.1 404 Not Found

  {"message":"Evento no encontrado"}
  ```

  Logs de Lambda consultados mediante:

  ```bash
  npx serverless logs -f listEvents --stage dev --region "us-east-1"
  npx serverless logs -f getEvent --stage dev --region "us-east-1"
  ```

  En los logs de `listEvents` aparece:

  ```text
  INFO LIST eventos: GET
  ```

  En los logs de `getEvent` aparecen ambos identificadores:

  ```text
  INFO GET evento: EVT-101
  INFO GET evento: NO-EXISTE
  ```

- **Limitaciones del ejercicio:** las comprobaciones realizadas cubren el listado de eventos y la consulta individual de un evento existente y otro inexistente. No he documentado aquí pruebas adicionales que no aparezcan en la transcripción. Se mantienen la cuenta, la región, el stage y el rol utilizados en el laboratorio, sin modificar las políticas IAM ni alterar el catálogo para forzar las respuestas.
