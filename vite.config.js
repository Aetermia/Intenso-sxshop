import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      // Solo en "npm run dev": lo que el sitio pida a /backend se reenvía al
      // PHP local (php -S localhost:8000, desde la raíz del repo). En
      // producción no hace falta: sitio y backend comparten dominio.
      proxy: {
        '/backend': {
          target: env.VITE_DEV_BACKEND || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  };
});
