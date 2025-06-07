import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuration optimisée pour la production
export default defineConfig(({ mode }) => ({
  base: './', // Chemins relatifs
  server: {
    host: true,
    port: 3000,
  },
  plugins: [
    react({
      jsxImportSource: 'react'
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimisations pour la production
    target: 'es2015', // Compatibilité navigateurs
    minify: 'esbuild',
    sourcemap: false, // Pas de sourcemap en production
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimisation pour le cache
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          charts: ['recharts'],
          pdf: ['jspdf', 'jspdf-autotable'],
        },
        // Noms de fichiers optimisés pour le cache
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    // Optimisations de build
    chunkSizeWarningLimit: 500,
    reportCompressedSize: false, // Plus rapide en build
  },
  // Optimisations pour le développement
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
