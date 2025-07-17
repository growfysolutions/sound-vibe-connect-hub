import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      babel: {
        plugins: [],
      },
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  esbuild: {
    target: 'es2020',
    jsx: 'automatic',
    jsxImportSource: 'react',
    // Override TypeScript config to avoid project reference issues
    tsconfig: mode === 'development' ? './tsconfig.development.json' : undefined,
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      external: [],
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}))