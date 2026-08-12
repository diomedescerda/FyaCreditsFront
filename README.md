# Fya Credits Frontend

Frontend de Angular `21.2.2` para registrar y consultar créditos, con interfaz en español y empaquetado para Android con Capacitor.

## Ramas

- **`main`**: la app apunta al **backend desplegado**.
- **`dev`**: la app apunta al **backend local** (desarrollo).

Para usar la app localmente, cambia a la rama `dev` y sigue las instrucciones de su `README.md`.

## Usar la app (backend desplegado)

La app está configurada para conectarse a la API desplegada (Azure):

```text
https://fya-credits-api-dkawb8byevc3befg.canadacentral-01.azurewebsites.net/api
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

La app se empaqueta para Android con Capacitor. El APK generado se conecta al backend desplegado.

### Descargar el APK

Descarga el APK de prueba (generado desde `main`, conectado al backend desplegado en Azure):

[Descargar fya-credits.apk](https://github.com/diomedescerda/FyaCreditsFront/releases/download/1.0/fya-credits.apk)

### Dónde está el APK

El APK de **debug** se genera en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

El APK de **release (firmado)** se genera en:

```text
android/app/build/outputs/apk/release/app-release.apk
```

### Requisitos para generar el APK

- Node.js 24+ y npm
- JDK 21 (por ejemplo, el incluido con Android Studio)
- Android SDK con las plataformas y build-tools requeridos
- Variables de entorno `JAVA_HOME` y `ANDROID_HOME` configuradas

### Generar el APK

1. Instala las dependencias y sincroniza los assets web con Capacitor:

   ```bash
   npm install
   npm run cap:sync
   ```

2. Genera el APK de debug:

   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. Instala el APK en un dispositivo Android conectado:

   ```bash
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

### Notas

- El APK usa la API desplegada (Azure). La URL se configura en `src/app/core/config/environment.ts`.
- Para probar la app con el backend **local**, usa la rama `dev` y vuelve a generar el APK.
- El **APK es el entregable a probar**: instálalo en un dispositivo Android e inicia sesión con las credenciales semilla (`ana.comercial@fyasocialcapital.com` / `FyaDev123!`).
