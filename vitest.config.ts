import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      "@": "./src",
      "@tests": "./tests",
    },
    include: ["./tests/**/**.test.ts"],
    exclude: ["./tests/e2e/**"],
  },
});
