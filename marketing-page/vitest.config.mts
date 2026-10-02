import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    // globals: Testing Library auto-cleans the DOM between tests only when afterEach is global.
    globals: true,
    include: ["__tests__/**/*.test.{ts,tsx}"],
  },
});
