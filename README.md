# Geopolitics React App

This project is a simple React-based simulation served using a minimal Node.js HTTP server.

## Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)

## Installation

Install dependencies after cloning the repository:

```bash
npm install
```

## Running the App

Two scripts are provided in `package.json`:

- `npm run start` – launch the Node.js server.
- `npm run dev` – identical to `npm run start` and useful for development.

Both scripts start `server.js`, which serves the static files on **http://localhost:5000**.

```bash
npm run dev
```

Open a browser and navigate to `http://localhost:5000` to see the simulation.

There is no build step because the project uses the Babel standalone runtime in `index.html` to transform the React/TypeScript code on the fly.

## TypeScript Compilation

TypeScript support is included for type checking. You can run the compiler manually:

```bash
npx tsc
```

The command uses `tsconfig.json` and outputs JavaScript files alongside the `.tsx` sources. This is optional when running the app via the browser-based setup but useful for static checks or generating JavaScript versions of the components.

## Workflow Summary

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev` (or `npm start`).
3. Optionally run `npx tsc` to type-check and compile the TypeScript files.

