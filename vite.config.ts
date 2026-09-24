import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Desativa o SSR para o compilador gerar o index.html estático correto
  nitro: {
    preset: "static",
    ssr: false
  },
  tanstackStart: {
    // Evita que o servidor tente rodar rotas de API/SSR no deploy estático
    ssr: false,
    server: { entry: "server" },
  },
});
