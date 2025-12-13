import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      reactstrap: path.resolve(__dirname, './src/vendor/reactstrap.tsx')
    }
  },
  server: {
    port: 5173
  }
});
