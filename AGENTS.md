# Frontend Project Instructions

## Project Scope

This repository contains the frontend for the credit-management technical test.

- Framework: Angular `21.2.2`
- Mobile packaging: Capacitor
- Primary Android deliverable: signed release `.apk`
- Optional Android deliverable: `.aab` for store distribution
- UI language: Spanish

Keep frontend implementation in this repository. Backend implementation and infrastructure belong to their respective project repository.

## Functional Requirements

The frontend must provide a clear, functional, and responsive UI for:

### Credit Registration

Provide a registration form with the following fields:

- Client name
- Client ID or identification number
- Credit amount
- Interest rate
- Term in months
- Authenticated commercial representative, displayed as read-only
- A clearly visible register/submit button

The form must validate required fields and valid values before submission. Display loading, success, and error states. Backend validation remains authoritative; frontend validation must not be treated as a security boundary.

The commercial representative is the logged-in user. Do not allow the user to freely edit or select the commercial identity for a registration, and do not send an independently trusted commercial value when the backend derives it from authentication.

Money values must be numeric integer values internally, without decimal fractions. For example, store and send `300000`, not `"300.000"`. Format money only when rendering it to users, using the Spanish Colombian locale where appropriate, such as `300.000` or `$300.000`.

After a successful registration, the frontend must not send email directly. Email delivery is a backend responsibility and occurs asynchronously.

### Credit Consultation

Provide a table containing all registered credits with:

- Client name
- Client ID
- Credit amount
- Interest rate
- Term in months
- Commercial representative
- Registration date

Support filtering by client name, client ID, and commercial representative. Support sorting by registration date and credit amount. Handle loading, empty, error, and populated states clearly.

Filtering and sorting must be performed server-side through the backend API. Send the active filters and sort settings as API query parameters instead of loading all credits and processing the complete dataset in the frontend. If the API supports pagination, use it and refresh the results whenever filters or sort settings change.

## Angular Practices

- Use standalone components and provider-based application configuration.
- Use Angular's built-in control flow syntax in templates.
- Prefer signals for local UI state and derived state where appropriate.
- Use typed reactive forms with explicit validators.
- Keep HTTP calls in focused services, not in components or templates.
- Consume the backend OpenAPI contract and avoid duplicating API assumptions.
- Keep components focused on presentation and user interaction.
- Keep business logic, data mapping, filtering, and sorting out of templates.
- Use route-level lazy loading when it provides a clear benefit.
- Use `ChangeDetectionStrategy.OnPush` for components unless there is a concrete reason not to.
- Avoid unnecessary subscriptions, `any`, duplicated logic, and premature abstractions.
- Prefer Angular and platform APIs over adding dependencies without a clear need.
- Keep environment-specific API configuration outside application logic.
- Never put secrets, SMTP credentials, or private backend configuration in the frontend.

## UX, Accessibility, and Security

- Display the complete user interface in Spanish, including labels, buttons, validation messages, errors, empty states, loading states, notifications, and accessibility text.
- Support desktop and mobile screen sizes.
- Use semantic HTML, associated labels, keyboard-accessible controls, and useful focus states.
- Make validation messages specific and accessible.
- Format currency, percentages, dates, and numbers consistently using locale-aware Spanish formatting.
- Prevent duplicate submissions while a request is in progress.
- Display API failures without exposing sensitive implementation details.
- Escape and safely render user-provided values.
- Treat all client-side data as untrusted and rely on the backend for authentication, authorization, and security enforcement.

## Capacitor and Android Delivery

- Keep the web application compatible with Capacitor.
- Configure and test the Android project through Capacitor rather than maintaining a separate Android implementation.
- Verify the production web build before syncing native assets.
- Generate and test a signed release `.apk` as the primary technical-test artifact.
- Prefer a universal APK unless device-specific APKs are required.
- Generate an `.aab` only when store distribution is needed.
- Do not commit signing keys, passwords, or other credentials. Document required signing configuration using safe placeholders.
- Test the APK on a real or emulated Android device, including registration, consultation, filtering, sorting, loading, and error flows.

## Testing and Quality

Add tests for behavior that is important to the evaluation, including:

- Registration form validation and submission states
- API service behavior and error handling
- Credit table rendering
- Filtering and sorting
- Empty and loading states
- Responsive and accessible interaction where practical

Before delivery, run the project's formatting, linting, tests, and production build commands. Update `README.md` with setup instructions, required environment configuration, web execution, Capacitor synchronization, APK generation, and APK installation/testing steps.

Do not mark a feature complete until its user-visible behavior, error handling, and relevant tests have been verified.
