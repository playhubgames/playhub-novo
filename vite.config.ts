import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        primary: './2por94.html',
        secondary: './3por94.html',
      },
    },
  },
});
