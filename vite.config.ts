
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Use esbuild for compilation, skip TypeScript checking
    rollupOptions: {
      external: []
    }
  },
  esbuild: {
    // Use esbuild for all TypeScript compilation and ignore errors
    target: 'esnext',
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Skip TypeScript checking entirely
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
}))
