# Fya Credits Frontend

Angular `21.2.2` frontend for registering and consulting credits. The interface is in Spanish and is packaged for Android with Capacitor.

## Requirements

- Node.js 24+
- npm 11+
- Angular CLI 21.2.2
- A running backend API

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

Build the web application and synchronize native assets:

```bash
npm run cap:sync
```

Open the Android project in Android Studio:

```bash
npm run android:open
```

For an Android emulator, configure the API URL as `http://10.0.2.2:8080/api` so the emulator can reach an API running on the host machine. For a physical device, use the host machine's network IP or a deployed HTTPS API URL.

Generate the signed release `.apk` from Android Studio or Gradle. The APK is the primary technical-test artifact; an `.aab` may be generated for store distribution.

Never commit signing keys, passwords, API secrets, or environment-specific private configuration.
