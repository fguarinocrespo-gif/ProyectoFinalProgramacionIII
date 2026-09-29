import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/seeds/**', 'src/server.ts'],
    },
    testTimeout: 30000,
    hookTimeout: 120000,
    setupFiles: ['./tests/setup.ts'],
  },
});
