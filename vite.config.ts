import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        page: 'src/pages/index.html',
        background: 'src/background/worker.ts',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  server: {
    open: '/pages/index.html',
  },
})
