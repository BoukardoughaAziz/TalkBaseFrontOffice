import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external access
    port: 55555, // Ensure this is correct
    cors: true, // Enable CORS
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow all origins
    },
    https: {
      key: './certificate/key.pem',
      cert: './certificate/cert.pem'
    }
  },
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
