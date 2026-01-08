// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Для продакшну на GitHub Pages/Netlify/Vercel — залиш '/'
  server: {
    port: 3000,
    open: true, // Автоматично відкриває браузер
  },
  resolve: {
    alias: {
      '@': '/src', // Зручно: import { Layout } from '@/components/Layout'
    },
  },
});