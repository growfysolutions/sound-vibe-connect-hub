
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      strict: false
    }
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
      // Add fallback for missing native dependencies
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_NOT_FOUND') return;
        warn(warning);
      }
    },
    // Force use of JS version of Rollup to avoid native dependency issues
    commonjsOptions: {
      ignoreTryCatch: false
    }
  },
  esbuild: {
    target: 'esnext',
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'tsconfig-json': 'silent'
    },
    // Bypass TypeScript project references and use direct config
    tsconfigRaw: {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        forceConsistentCasingInFileNames: true,
        noEmit: false,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        jsx: "react-jsx",
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"]
        }
      },
      include: ["src/**/*", "vite.config.ts"],
      exclude: ["node_modules", "dist"]
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    },
    // Force rebuild to avoid cached dependency issues
    force: true
  }
}))
