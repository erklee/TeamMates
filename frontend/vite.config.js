import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production",
    }),
  ],
  server: {
    proxy: {
      // Proxy local API calls to the backend during development
      "/api": {
        target: mode === "production" ? "https://team-mates-backend.vercel.app" : "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
    // Uncomment this if you want to open the browser automatically
    // open: true
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
}));
