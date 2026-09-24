import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Adicione esta condicional para o Nitro entender o build do Netlify
  nitro: process.env.NETLIFY ? { preset: "netlify-edge" } : undefined,
  tanstackStart: {
    server: { entry: "server" },
  },
});
