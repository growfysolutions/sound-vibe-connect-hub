
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
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
    }
  },
  esbuild: {
    target: 'esnext',
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'tsconfig-json': 'silent'
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    },
    include: ['react', 'react-dom', '@radix-ui/react-slot'],
    force: true
  }
}))
