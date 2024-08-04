import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
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
      "/api": "http://localhost:3000",
    },
    // Uncomment this if you want to open the browser automatically
    // open: true
  },
  build: {
    rollupOptions: {
      input: 'index.html', // Ensure the input is set to index.html
    },
  },
}));

