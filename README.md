# Geopolitics


This project is built with **Vite** and **React**. The following commands help you get up and running.

## Install dependencies

A simple React-based prototype for a geopolitical simulation.

The app now includes a tiny economy demo with random events, a GDP trend
chart, and an event log so players can experiment with basic decisions and
see their impact over time. Launch the dev server and click **Start
Simulation** to try it out. Open **Settings** to change how often random
events occur or enable a playful *Fun Mode* with exaggerated impacts. Use
**How to Play** for quick instructions.

## Getting Started

Install dependencies and start the development server:
main

```bash
npm install
npm run dev
```


## Start the development server

```bash
npm run dev
```

Vite will start on <http://localhost:5173> by default.

## Build for production

```bash
npm run build
```

The build output is placed in the `dist/` directory.

## Serve the production build

After building, you can serve the files locally with:

```bash
node server.js
```

This starts a simple HTTP server at <http://localhost:5000>.

## Run tests

```bash
npm test
```

This project uses [Vitest](https://vitest.dev/) for unit testing.

Run a TypeScript check before committing code:

```bash
npm run typecheck
```

To build the production files and preview them locally:

```bash
npm run build
npm run serve
```
By default the server runs on `http://localhost:5000`. Set the `PORT`
environment variable to override the port if needed.
 main
