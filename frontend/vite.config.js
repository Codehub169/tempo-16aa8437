import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Port for Vite dev server, distinct from the production port 9000 served by backend.
    strictPort: true, // Ensuring this is JavaScript 'true'
    proxy: {
      // Proxy API requests to the backend server during development
      '/api': {
        target: 'http://localhost:9000', // Backend server address from logs
        changeOrigin: true,             // Ensuring this is JavaScript 'true'
      },
    },
  },
  build: {
    outDir: 'dist', // Ensure build output is in 'dist' as expected by backend
  }
});
