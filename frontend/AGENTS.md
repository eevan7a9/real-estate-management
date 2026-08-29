# AGENTS.md

This frontend is built with Angular 20, Ionic Framework 9, Tailwind CSS 4, and
Capacitor. The application uses feature-based NgModules and is packaged for the
web and Android.

## Angular

- Prefer signals, `computed()`, and `effect()` for local and derived component
  state.
- Services use RxJS observables and `BehaviorSubject` for shared and
  asynchronous state. Follow the surrounding service's existing pattern rather
  than converting state approaches as part of an unrelated change.
- Convert observables for template consumption with Angular interop utilities
  such as `toSignal()` when that matches nearby code.
- Clean up subscriptions with Angular lifecycle interop such as
  `takeUntilDestroyed()`; do not introduce unmanaged subscriptions.
- The project uses NgModules. Components and pages must use
  `standalone: false` and be declared in the appropriate feature or shared
  module.
- Prefer Angular's built-in APIs and patterns before adding custom abstractions
  or dependencies.
- Keep components focused on presentation and interaction. Put reusable or
  shared business and API logic in services.

## Ionic and UI

- Prefer Ionic components and controllers (`ion-button`, `ion-input`,
  `ion-modal`, `ModalController`, `ToastController`, and similar) when an
  appropriate Ionic primitive exists.
- Follow existing pages, modals, cards, shared components, and navigation
  patterns before creating new UI abstractions.
- Keep layouts responsive and mobile-first while preserving the existing
  desktop and split-pane experience.
- Account for Ionic lifecycle and native/mobile behavior when changing pages or
  interactions.

## Styling

- Use Tailwind CSS v4 utilities as the primary styling approach. Tailwind's
  source is `src/tailwind.css`, and the generated stylesheet is
  `src/tailwind-generated.css`.
- Reuse the Ionic-backed color tokens and custom theme values defined in
  `src/tailwind.css` and `src/theme/variables.css`.
- Prefer Tailwind utilities over new component CSS when they can reasonably
  express the design.
- Use component CSS for Ionic CSS custom properties, third-party integration
  styles, or behavior that utilities cannot express clearly.
- Preserve the class-based dark-mode convention (`.dark`) and test new UI in
  both themes when relevant.

## TypeScript

- Keep code strongly typed and compatible with strict Angular templates.
- Avoid `any`; narrow `unknown` values and use the existing interfaces, enums,
  and API response types under `src/app/shared` when available.
- Use the `@app/*` path alias for cross-feature imports when it improves
  clarity, while following the convention of the file being edited.
- Follow the existing naming and feature-folder conventions. Components use
  the `app-` prefix and kebab-case selectors.
- Do not leave debug logs, commented-out code, unused imports, or dead members.

## Data, Authentication, and Environment

- Keep HTTP and persistence concerns in services. Preserve the existing typed
  API response and request-option patterns.
- Authentication requests participate in the existing refresh interceptor.
  Reuse its request context tokens for opt-out or retry behavior rather than
  bypassing the flow.
- Environment values come from `.env` or `.env.production` through
  `scripts/generate-environments.cjs`. Never commit secrets or edit the
  generated `src/environments/environment.generated.ts` directly.
- Update `.env.example` when introducing a required or supported environment
  variable.

## Testing

- Keep colocated `*.spec.ts` tests in Karma/Jasmine style.
- Add or update focused tests when changing non-trivial component behavior,
  services, guards, interceptors, or shared utilities.
- Mock HTTP and shared services using the patterns in nearby specs.

## Before Finishing

- Format changed source files:

  ```bash
  npm run format
  ```

- Because the format script only targets `src`, format changed root-level files
  separately when needed, for example:

  ```bash
  npx prettier --write AGENTS.md
  ```

- When adding or changing Tailwind classes, theme tokens, or styles, rebuild
  the generated Tailwind stylesheet:

  ```bash
  npm run tailwind:build
  ```

- Run the checks appropriate to the change:

  ```bash
  npm run lint
  npm test -- --watch=false
  npm run build:development
  ```

- Production builds require a configured `.env.production`; development and
  test commands generate the environment file from `.env`.

## General

- Inspect nearby code before implementing a change and follow established
  project patterns.
- Keep changes focused on the requested task and avoid unrelated refactors or
  dependency updates.
- Reuse existing components, services, utilities, types, and design tokens.
- Do not hand-edit generated assets such as `src/tailwind-generated.css` or
  generated environment files; update their sources and run the corresponding
  generator.
- Treat the `android/` directory as Capacitor native-platform code. Change it
  only when the task specifically requires an Android or native integration
  update.
