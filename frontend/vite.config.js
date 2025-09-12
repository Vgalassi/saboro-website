import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.100.10:3001",
        changeOrigin: true,
      },
      "/images": {
        target: "http://192.168.100.10:3001",
        changeOrigin: true,
      }
    }
  }
});

