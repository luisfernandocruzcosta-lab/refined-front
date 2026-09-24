import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Desativa o SSR para o Nitro gerar apenas os arquivos estáticos de cliente
  nitro: {
    preset: "static",
    ssr: false
  },
  tanstackStart: {
    // Aponta explicitamente para a entrada do servidor padrão se necessário
    server: { entry: "server" },
  },
});
