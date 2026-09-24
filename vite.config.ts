import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Adicione esta linha para mudar o alvo do Nitro para o Netlify
  nitro: {
    preset: "netlify"
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
