import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      // This will proxy any request starting with /api to your Node.js backend
      '/api': {
        target: 'http://localhost:3000', // Your Node.js server
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Recommended for http targets
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
