# Archi Appli Front

Frontend React + TypeScript + Vite (contexte etudiant) pour une plateforme de spectacles:

- authentification Keycloak
- consultation et recherche de spectacles
- reservation de billets
- espace admin (stats + gestion de spectacles)

## Prerequis

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Configuration

Le projet lit ces variables Vite:

- `VITE_API_BASE` (obligatoire): base URL API (ex: `http://localhost:8080/api`)
- `VITE_KEYCLOAK_URL` (obligatoire hors mock): URL Keycloak
- `VITE_KEYCLOAK_REALM` (obligatoire hors mock): realm Keycloak
- `VITE_KEYCLOAK_CLIENT_ID` (obligatoire hors mock): client ID Keycloak
- `VITE_E2E_MOCK_AUTH` (optionnel): mode auth mock pour tests E2E

Exemple `.env.local`:

```bash
VITE_API_BASE=http://localhost:8080/api
VITE_KEYCLOAK_URL=https://key.serveralin.work/
VITE_KEYCLOAK_REALM=archiapp
VITE_KEYCLOAK_CLIENT_ID=archiapp-backend
```

## Lancer en local

```bash
npm run dev
```

Application disponible via Vite (port affiche dans le terminal).

## Scripts

- `npm run dev`: demarrage local Vite
- `npm run build`: compilation TypeScript + build Vite
- `npm run preview`: preview du build
- `npm run lint`: verification ESLint
- `npm run test`: Vitest en mode watch
- `npm run test:run`: execution unitaire/integration en une passe
- `npm run test:coverage`: execution + couverture
- `npm run test:e2e`: scenarios E2E Playwright

## Tests

### Unitaires / integration (Vitest + Testing Library + MSW)

Couverture des zones principales:

- composants de securite (`ProtectedRoute`, `RequireRole`, `Navbar`)
- composants metier (`SpectacleCard`, `SpectacleModal`, etc.)
- hooks/composables (`useReservation`, `useSpectacle`, `useStats`, ...)
- flux de reservation et regles UI associees

### E2E (Playwright)

Scenarios presents dans `e2e/`:

- auth (`auth.spec.ts`)
- reservations (`reservations.spec.ts`)
- spectacles (`spectacles.spec.ts`)
- admin (`admin.spec.ts`)

Les E2E tournent en mode auth mock (`VITE_E2E_MOCK_AUTH=true`) pour rester independants d un serveur Keycloak reel.

## Docker

Build + run via Compose:

```bash
docker compose up --build
```

Puis ouvrir `http://localhost:5173`.

Le conteneur runtime sert le build statique via Nginx.

## Structure utile

- `src/pages/`: pages applicatives (home, login, spectacles, reservations, admin)
- `src/components/`: composants UI et composants de protection des routes
- `src/composables/`: logique metier et acces API
- `src/config/keycloak.ts`: initialisation Keycloak
- `src/test/msw/`: fixtures et handlers pour tests
- `e2e/`: scenarios Playwright

## Verification rapide

```bash
npm run lint
npm run test:run
npm run test:e2e
```

## Notes

- En local, sans variables Keycloak valides, les flux relies a l authentification reelle peuvent echouer.
- Pour les scenarios automatisees, privilegier le mode mock E2E.
