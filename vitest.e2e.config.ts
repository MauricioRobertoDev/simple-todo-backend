import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./e2e-setup.ts",
    alias: {
      "@": "./src",
      "@tests": "./tests",
    },
    globals: true,
    include: ["./tests/e2e/**.test.ts"],
  },
});
