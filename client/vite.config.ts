import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr(), react()],
  base: '/', // Set the base path where your app will be hosted
  build: {
    // Specify the custom index.html file
    rollupOptions: {
      input: {
        main: './src/main.tsx', // Specify the entry point for your app
        html: 'index.html', // Specify the path to your index.html file
      },
    },
    outDir: 'dist', // This is the default, but you can specify it explicitly
    assetsDir: 'assets', // You can customize the assets directory if needed
    sourcemap: true, // Enable sourcemap generation if needed
  },
});