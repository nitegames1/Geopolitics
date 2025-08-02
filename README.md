# Geopolitics

A simple React-based prototype for a geopolitical simulation.

The app now includes a tiny economy demo with random events, a GDP trend
chart, and an event log so players can experiment with basic decisions and
see their impact over time. Launch the dev server and click **Start
Simulation** to try it out. Open **Settings** to set the starting GDP, choose
a difficulty level that adjusts event odds and policy power, enable a playful
*Fun Mode* with exaggerated effects, or toggle a light theme for better
readability. Use **How to Play** for quick instructions.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

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
