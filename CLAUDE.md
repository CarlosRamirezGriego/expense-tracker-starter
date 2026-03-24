# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint across all JS/JSX files
- `npm run preview` — preview production build

## Architecture

Single-page React 19 app (Vite, JSX, no TypeScript). All application logic currently lives in `src/App.jsx` as a single component with local `useState` hooks. No routing, no backend, no external state management.

Transaction data is hardcoded in state (not persisted). Amounts are stored as strings, which causes a known bug in the income/expense/balance summary calculations (string concatenation instead of numeric addition).

## Lint Rules

ESLint uses flat config (`eslint.config.js`) with react-hooks and react-refresh plugins. `no-unused-vars` ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`).
