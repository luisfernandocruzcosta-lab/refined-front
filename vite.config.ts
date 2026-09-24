import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Se estiver rodando no Netlify, ativa o preset do Netlify para o Nitro
  nitro: process.env.NETLIFY ? { preset: "netlify" } : undefined,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
