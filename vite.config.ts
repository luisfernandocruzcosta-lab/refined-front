import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Força o Nitro a gerar um build estático compatível com o Netlify
  nitro: {
    preset: "static"
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
