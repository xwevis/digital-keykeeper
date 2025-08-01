import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import mkcert from 'vite-plugin-mkcert'; // 1. Import plugin

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    https: true // 2. Aktifkan mode HTTPS
  },
  plugins: [
    react(),
    mkcert(), // 3. Tambahkan plugin mkcert
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
