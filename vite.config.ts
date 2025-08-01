import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
<<<<<<< HEAD
  base: "/Geopolitics/", // exactly matches your repo name
  plugins: [react()],
});

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  base: '/Geopolitics/',
=======
  base: '/Geopolitics/', // important for GitHub Pages
  plugins: [react()],
>>>>>>> 3653a40 (Fix default export)
});

