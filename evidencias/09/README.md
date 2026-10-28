# Bloque 09 — Comparación entre entorno local y AWS

## Resultado

- **Qué añadí al proyecto:**
  He comprobado el funcionamiento de la API de Festival Control desplegada en AWS y su configuración para trabajar con el frontend web. La API está publicada mediante Amazon API Gateway y utiliza funciones AWS Lambda para gestionar las peticiones. He revisado los endpoints disponibles, las respuestas HTTP y los registros de ejecución de las funciones.

- **Ruta o pantalla comprobada:**
  - Backend: carpeta `backend`.
  - Frontend: carpeta `mobile`, ejecutada mediante Expo Web.
  - URL local del frontend: `http://localhost:8081`.
  - URL base de la API de AWS: `https://2yjemcpq1h.execute-api.us-east-1.amazonaws.com/dev`.
  - Endpoints comprobados:
    - `GET /events`
    - `GET /events/EVT-101`
    - `GET /events/NO-EXISTE`
    - Operaciones `POST`, `PUT`, `PATCH` y `DELETE` mediante sus respectivas funciones Lambda.

- **Estado y respuesta observados:**
  - La API está desplegada en AWS en la región `us-east-1`, con stage `dev`.
  - El comando `npx serverless info --stage dev --region us-east-1` muestra los siete endpoints y las siete funciones Lambda del proyecto.
  - `GET /events` devuelve `HTTP 200 OK` y los dos eventos originales:
    - `EVT-101`: Neon Waves, Main Stage, 22:30, CONFIRMED.
    - `EVT-102`: Midnight Session, Club Stage, 23:45, CONFIRMED.
  - `GET /events/EVT-101` devuelve `HTTP 200 OK` con los datos del evento.
  - `GET /events/NO-EXISTE` devuelve `HTTP 404 Not Found` con el mensaje `Evento no encontrado`.
  - En CloudWatch se han encontrado registros de ejecución para las operaciones `POST`, `PUT`, `PATCH` y `DELETE`.
  - Después de las operaciones de escritura, una nueva petición `GET /events` sigue devolviendo los dos eventos originales. Esto es coherente con el comportamiento simulado de las operaciones de escritura descrito en el ejercicio.

## Comprensión

- **Recorrido del dato, explicado con mis palabras:**

  El usuario interactúa con la interfaz web de Festival Control, desarrollada con React Native y ejecutada en el navegador mediante Expo Web. Cuando se necesita consultar o modificar un evento, el frontend utiliza las funciones definidas en `api.ts` para enviar una petición HTTP a la API.

  La petición llega a Amazon API Gateway, que la dirige a la función Lambda correspondiente según el método HTTP y la ruta solicitada. Por ejemplo, `GET /events` se dirige a `listEvents`, mientras que `PATCH /events/EVT-101` se dirige a `updateEvent`.

  La función procesa la petición y devuelve una respuesta JSON con el código HTTP correspondiente. Además, las funciones generan registros que pueden consultarse en CloudWatch para comprobar su ejecución.

  De esta forma, el frontend puede comunicarse con la API sin tener que implementar directamente la lógica del backend.

- **Cambio guiado y resultado:**

  El bloque consiste en utilizar la URL base del backend de AWS desde el cliente, manteniendo las funciones existentes de `api.ts`, los tipos de `types.ts` y la interfaz de `App.tsx`.

  La URL base de AWS identificada mediante Serverless es:

  `https://2yjemcpq1h.execute-api.us-east-1.amazonaws.com/dev`

  La aplicación debe utilizar esta URL como base para construir las peticiones a `/events` y a las rutas de cada evento, sin incluir `/events` en el valor de `API_URL`.

  El backend desplegado responde correctamente a las peticiones realizadas mediante `curl`, y las funciones Lambda correspondientes registran las operaciones observadas.

- **Error encontrado y cómo lo resolví:**

  Durante las comprobaciones aparecieron algunos errores de ejecución de comandos:

  1. Al ejecutar `npm run web` desde la carpeta `backend`, npm indicó que no existía ese script. Lo resolví entrando en la carpeta `mobile`, donde está configurado el frontend.
  2. Al ejecutar un comando de Serverless desde la raíz del proyecto, apareció el mensaje `No configuration file found`. La solución fue ejecutar los comandos desde la carpeta `backend`, donde se encuentra `serverless.yml`.
  3. En algunas ejecuciones apareció el aviso de Node.js `DEP0169`, relacionado con el uso de `url.parse()`. El aviso no impidió que los comandos de Serverless terminaran correctamente.
  4. En una ocasión, la terminal interpretó el prefijo `[200~` como parte del comando. Fue un problema al pegar el texto en la terminal, no un error de la aplicación.

## Evidencias

- **Captura o transcripción breve, sin credenciales:**

  **1. API desplegada**

  Comando ejecutado:

  ```bash
  npx serverless info --stage dev --region us-east-1
  ```

  Resultado relevante:

  ```text
  service: festival-control-api-alumno01
  stage: dev
  region: us-east-1
  ```

  La salida también muestra los siete endpoints y las siete funciones Lambda.

  **2. Consulta del listado de eventos**

  Comando ejecutado:

  ```bash
  curl -i https://2yjemcpq1h.execute-api.us-east-1.amazonaws.com/dev/events
  ```

  Resultado observado:

  ```text
  HTTP/1.1 200 OK
  Content-Type: application/json
  ```

  Respuesta JSON:

  ```json
  [
    {
      "id": "EVT-101",
      "artist": "Neon Waves",
      "space": "Main Stage",
      "time": "22:30",
      "status": "CONFIRMED"
    },
    {
      "id": "EVT-102",
      "artist": "Midnight Session",
      "space": "Club Stage",
      "time": "23:45",
      "status": "CONFIRMED"
    }
  ]
  ```

  **3. Consulta de un evento inexistente**

  La petición `GET /events/NO-EXISTE` devolvió:

  ```text
  HTTP/1.1 404 Not Found
  {"message":"Evento no encontrado"}
  ```

  **4. Registros de las operaciones en CloudWatch**

  Los comandos ejecutados desde `backend` fueron:

  ```bash
  npx serverless logs -f createEvent --stage dev --region us-east-1
  npx serverless logs -f replaceEvent --stage dev --region us-east-1
  npx serverless logs -f updateEvent --stage dev --region us-east-1
  npx serverless logs -f deleteEvent --stage dev --region us-east-1
  npx serverless logs -f listEvents --stage dev --region us-east-1
  ```

  Entre los registros obtenidos aparecen:

  ```text
  INFO POST evento: Nova Pulse
  INFO PUT evento: EVT-101
  INFO PATCH evento: EVT-101
  INFO DELETE evento: EVT-102
  INFO LIST eventos: GET
  ```

  Estos registros permiten relacionar las operaciones recibidas con las funciones Lambda que las procesan.

  **5. Comprobación final del listado**

  Tras las operaciones anteriores, se volvió a ejecutar `GET /events`. La respuesta fue `HTTP 200 OK` y el listado seguía conteniendo `EVT-101` y `EVT-102`, ambos con estado `CONFIRMED`.

- **Limitaciones del ejercicio:**

  - Las operaciones de escritura están simuladas y no mantienen los cambios en el listado de eventos, según el comportamiento previsto en el ejercicio.
  - El frontend se ejecuta localmente mediante Expo Web, mientras que el backend se encuentra desplegado en AWS.
  - La consulta de los logs confirma que las funciones Lambda se ejecutaron, pero no demuestra por sí sola el código HTTP devuelto por cada operación.
  - Las respuestas HTTP de `POST`, `PUT`, `PATCH` y `DELETE` deben documentarse con las capturas de Network o con las respuestas de las peticiones si se quiere acreditar el código de cada una.
  - Para completar la comparación visual entre local y cloud, conviene conservar las capturas de Network y de CloudWatch obtenidas durante las pruebas.
