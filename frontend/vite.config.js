import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    // Adicione esta seção 'server'
    host: '0.0.0.0', // Permite que o Vite seja acessado de fora do container
    proxy: {
      "/api": {
        // Alvo agora é o NOME DO SERVIÇO do docker-compose
        target: "http://backend:3001", 
        changeOrigin: true,
      },
      "/images": {
        // Alvo também é o serviço backend
        target: "http://backend:3001",
        changeOrigin: true,
      }
    }
  }
});
