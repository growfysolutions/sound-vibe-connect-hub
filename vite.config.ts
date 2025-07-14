
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
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
    minify: 'terser',
    target: 'es2015',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  esbuild: {
    include: /\.(tsx?|jsx?)$/,
    exclude: [],
    loader: 'tsx',
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        target: 'es2015',
        module: 'esnext',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true,
        strict: false,
        noEmit: true,
        isolatedModules: true,
        useDefineForClassFields: true,
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}))
