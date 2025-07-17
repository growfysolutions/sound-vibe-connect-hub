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
    rollupOptions: {
      external: []
    }
  },
  esbuild: {
    target: 'esnext',
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'tsconfig-json': 'silent'
    },
    tsconfigRaw: {
      compilerOptions: {
        target: "esnext",
        module: "esnext", 
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        jsx: "react-jsx",
        noEmit: true,
        isolatedModules: true,
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"]
        }
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"]
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
  // Completely bypass TypeScript project checking
  clearScreen: false,
  logLevel: 'warn'
}))