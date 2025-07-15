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
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    include: /\.[jt]sx?$/,
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        target: 'es2020',
        useDefineForClassFields: true,
        lib: ['es2020', 'dom'],
        module: 'esnext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        strict: false,
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*']
        }
      }
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}))