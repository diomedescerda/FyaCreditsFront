# Fya Credits Frontend

Angular `21.2.2` frontend for registering and consulting credits. The interface is in Spanish and is packaged for Android with Capacitor.

## Requisitos

### Sistema y herramientas

- Node.js 24+ y npm 11+
- Angular CLI 21.2.2
- JDK 21 LTS (el build de Android Gradle no soporta Java 26 actualmente)
- Android SDK con las plataformas y build-tools requeridos por el proyecto Capacitor
- Un backend API en ejecución (local)

### Variables de entorno del sistema (build de Android)

Configura estas variables antes de generar el APK:

```bash
export JAVA_HOME=/ruta/al/jdk-21
export ANDROID_HOME=/ruta/al/Android/Sdk
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

### Configuración de la app (variable principal)

La app se configura con la URL de la API en `src/app/core/config/environment.ts`:

```ts
export const environment = {
  apiBaseUrl: 'http://localhost:8080/api',
};
```

- En la rama **`dev`** apunta al **backend local** (`http://localhost:8080/api`).
- Para usar el **backend desplegado**, usa la rama **`main`** (indicado en su `README.md`).

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm start
```

The API base URL is configured in `src/app/core/config/environment.ts`. The default value is `http://localhost:8080/api`.

The backend development token flow uses the commercial name and password configured by the backend. The commercial is taken from the authenticated session and is not sent as an independently trusted registration field.

## Quality Checks

```bash
npm run build
npm test -- --watch=false
```

Credit filtering and sorting are sent to the API as query parameters and are not performed over the complete dataset in the frontend.

## Capacitor Android

Configure the Android toolchain before building. Android Studio's bundled JDK 21 can be used:

```bash
export JAVA_HOME=/path/to/android-studio/jbr
export ANDROID_HOME=/path/to/Android/Sdk
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

Build the web application and synchronize native assets:

```bash
npm run cap:sync
```

Open the Android project in Android Studio:

```bash
npm run android:open
```

For an Android emulator, configure the API URL as `http://10.0.2.2:8080/api` so the emulator can reach an API running on the host machine. For a physical device, use the host machine's network IP or a deployed HTTPS API URL.

Build a debug APK with Gradle:

```bash
cd android
./gradlew assembleDebug
```

The debug artifact is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

Generate a release APK with `./gradlew assembleRelease`. The current release output is unsigned; configure a release keystore through private Gradle properties or environment variables before distributing it. The signed APK is the primary technical-test artifact; an `.aab` may be generated for store distribution.

Never commit signing keys, passwords, API secrets, or environment-specific private configuration.
