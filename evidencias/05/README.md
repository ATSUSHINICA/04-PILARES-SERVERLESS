# Bloque 05

## Resultado

- Qué añadí al proyecto: He instalado las dependencias de la aplicación móvil y he comprobado su funcionamiento en web con Expo.
- Ruta o pantalla comprobada: He ejecutado la aplicación desde la carpeta `mobile` y he probado la selección de la tarjeta `EVT-102` en `App.tsx`.
- Estado y respuesta observados: La comprobación de tipos termina sin errores y Expo inicia la aplicación web en `http://localhost:8081`. El resultado esperado del cambio es `Selección: EVT-102`.

## Comprensión

- Recorrido del dato, explicado con mis palabras: La aplicación guarda el identificador del evento seleccionado. Al cambiar la selección a `EVT-102`, la interfaz muestra ese identificador.

- Cambio guiado y resultado: He cambiado el valor de `setSelected` a `EVT-102` y el texto del botón a `Seleccionar EVT-102`. Después de comprobar la selección, he restaurado `EVT-101` para conservar el estado base del ejercicio.

- Error encontrado y cómo lo resolví: Durante la instalación aparecieron advertencias porque el proyecto requiere Node.js `>=22.13.0 <23` y tengo instalada la versión `v24.11.1`. A pesar de estas advertencias, la instalación terminó y la comprobación de tipos se ejecutó sin errores.

## Evidencias

- Captura o transcripción breve, sin credenciales:

Instalación de dependencias:

```text
added 724 packages, and audited 725 packages in 3m

10 vulnerabilities (5 low, 3 moderate, 2 high)
```

Comprobación de tipos:

```text
> festival-control-mobile@1.0.0 typecheck
> tsc --noEmit
```

Arranque de la aplicación web:

```text
> festival-control-mobile@1.0.0 web
> expo start --web

Web is waiting on http://localhost:8081

Web Bundled 15780ms node_modules\expo\AppEntry.js (179 modules)
```

- Limitaciones del ejercicio: He probado la aplicación en local mediante Expo Web. No he conectado la aplicación con la API ni he introducido peticiones HTTP. La instalación informa de 10 vulnerabilidades y de una versión de Node.js fuera del rango requerido por el proyecto.