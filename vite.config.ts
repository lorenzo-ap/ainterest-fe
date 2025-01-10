import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_X_RAPIDAPI_KEY': JSON.stringify(process.env.VITE_X_RAPIDAPI_KEY)
  }
});
