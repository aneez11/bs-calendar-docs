import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base + hash routing => deployable to any static host
// (GitHub Pages project sites, Netlify, S3, file://) without rewrites.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Windows: chokidar's fs.watch handle on editor temp files crashes with
    // EBUSY when files are swapped atomically; polling avoids that.
    watch: { usePolling: true, interval: 400 },
  },
  optimizeDeps: {
    // nepali-bs-calendar is a linked (file:) ESM package with its own dist — serve it
    // directly instead of pre-bundling into the dep optimizer.
    exclude: ['nepali-bs-calendar'],
  },
})
