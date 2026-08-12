# Fya Credits Frontend

Frontend de Angular `21.2.2` para registrar y consultar créditos, con interfaz en español y empaquetado para Android con Capacitor.

## Ramas

- **`main`**: la app apunta al **backend desplegado**.
- **`dev`**: la app apunta al **backend local** (desarrollo).

Para usar la app localmente, cambia a la rama `dev` y sigue las instrucciones de su `README.md`.

## Usar la app (backend desplegado)

La app está configurada para conectarse a la API desplegada:

```text
https://fyacreditsback-1cde.onrender.com/api
```

### Iniciar sesión

Puedes entrar con la cuenta semilla:

- **Correo:** `ana.comercial@fyasocialcapital.com`
- **Contraseña:** `FyaDev123!`

O crear una cuenta nueva desde la pantalla de registro.

### Qué puedes probar

- **Registrar un crédito**: nombre del cliente, cédula o ID, valor, tasa de interés (NM), plazo en meses. El comercial se toma del usuario que inició sesión.
- **Consultar créditos**: tabla con los créditos registrados.
- **Búsqueda unificada**: un solo campo para buscar por nombre del cliente, cédula o comercial.
- **Ordenar** por fecha o valor del crédito.
- **Paginación**: 15 registros por página, con botones Anterior/Siguiente.
- **Ver detalles**: botón "Ver detalles" por crédito.
- **Validaciones** de los formularios (mensajes en español).
- **Recuperar contraseña**: solicítala desde la app; recibirás un correo con un enlace que abre la app para restablecerla.

La interfaz está en español y los valores monetarios se muestran en pesos colombianos (COP).

## Android (APK)

Genera el APK de debug:

```bash
npm run cap:sync
cd android
./gradlew assembleDebug
```

El APK resultante usa la API desplegada. Instálalo con `adb install -r app/build/outputs/apk/debug/app-debug.apk`.
