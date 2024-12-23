import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  publicDir: 'public',
  assetsInclude: ['**/*.md'],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [resolve(__dirname, './src/styles/scss')],
        additionalData: `
          @use "variables" as *;
          @use "mixins" as *;
        `,
      },
    },
  },
});
