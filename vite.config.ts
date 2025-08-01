import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/Geopolitics/", // exactly matches your repo name
  plugins: [react()],
});

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  base: '/Geopolitics/',
});
