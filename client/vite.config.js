import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-server proxy so the React app can call /api/... and /uploads/...
// as if they were same-origin, while Express actually runs on :5000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
