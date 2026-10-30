import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '',
  plugins: [vue()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/autofill-cp.ts',
      output: {
        format: 'es',
        entryFileNames: 'autofill-cp.js',
        assetFileNames: 'autofill-cp[extname]',
      },
    },
  },
});
