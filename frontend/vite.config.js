import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const frontendNodeModules = path.resolve(__dirname, 'node_modules')

// Vite plugin to resolve bare module specifiers from frontend/node_modules
// when imported from files outside frontend (such as @admin)
function resolveFromFrontend() {
  return {
    name: 'resolve-from-frontend-node-modules',
    enforce: 'pre',
    resolveId(source, importer) {
      if (importer && !source.startsWith('.') && !source.startsWith('/') && !path.isAbsolute(source)) {
        try {
          const resolved = require.resolve(source, { paths: [frontendNodeModules] })
          if (path.isAbsolute(resolved) && resolved.includes('node_modules')) {
            return resolved
          }
        } catch {
          // fallback to default resolution
        }
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [react(), resolveFromFrontend()],
  resolve: {
    alias: {
      '@admin': path.resolve(__dirname, '../admin/src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom', 'axios', 'lucide-react'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        timeout: 300000,
        proxyTimeout: 300000,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        timeout: 300000,
        proxyTimeout: 300000,
      },
    },
  },
})
