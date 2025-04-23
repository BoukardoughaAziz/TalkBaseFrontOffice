import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
 
// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external access
    port: 55555, // Ensure this is correct
    cors: true, // Enable CORS
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow all origins
    },
    // https: {
    //   key: '../certificate3/example.com+5-key.pem',
    //   cert: '../certificate3/example.com+5.pem'
    // }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
