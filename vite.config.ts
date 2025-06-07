import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuration optimisée pour déploiement OVH
export default defineConfig(({ mode }) => ({
  base: './', // Chemins relatifs pour OVH
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
    // Optimisations pour la production OVH
    target: 'es2015', // Compatibilité navigateurs plus large
    minify: 'esbuild',
    sourcemap: false, // Pas de sourcemap en production
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimisation pour le cache OVH
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
    // Optimiser pour OVH
    chunkSizeWarningLimit: 500,
    reportCompressedSize: false, // Plus rapide en build
  },
  // Optimisations pour le développement
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
