import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  build: {
    // Enable code splitting by page
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        }
      }
    },
    // Enable gzip-level compression hints
    chunkSizeWarningLimit: 500,
    // Minify with esbuild (faster than terser)
    minify: 'esbuild',
    // Generate source maps for debugging (optional)
    sourcemap: false,
  },

  server: {
    proxy: {
      // This will proxy any request starting with /api to your Node.js backend
      '/api': {
        target: 'http://127.0.0.1:3000', // Your Node.js server
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