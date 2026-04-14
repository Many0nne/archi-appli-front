# Archi Appli Front

Projet frontend React + TypeScript + Vite (contexte etudiant) avec authentification Keycloak, parcours reservation et espace admin.

## Prerequis

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Lancer l'application

```bash
npm run dev
```

## Scripts utiles

- `npm run dev`: demarrage local
- `npm run build`: build TypeScript + Vite
- `npm run preview`: preview build
- `npm run lint`: lint
- `npm run test`: mode watch Vitest
- `npm run test:run`: execution complete unit/integration
- `npm run test:coverage`: rapport de couverture
- `npm run test:e2e`: smoke E2E Playwright

## Tests en place

### Unitaires / Integration (Vitest + RTL + MSW)

- Tests composables API et reservation
- Tests composant `RequireRole`
- Tests integration `SpectacleModal`
- Tests de contrats front minimaux sur `Spectacle` et `Reservation`

### E2E smoke (Playwright)

- 1 scenario smoke sur page d accueil
- Mode auth mocke pour eviter la dependance Keycloak en CI locale

## Strategie (scope etudiant)

- Objectif: robustesse pragmatique, pas d overkill.
- Les tests "enterprise" lourds sont exclus (SSO reel CI, chaos testing, etc.).
- La politique complete est documentee dans `spec.md`.

## Commandes de verification rapide

```bash
npm run lint
npm run test:run
npm run test:e2e
```
