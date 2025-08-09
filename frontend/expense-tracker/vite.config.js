import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      include: '**/*.jsx',
    }),
  ],
  server: {
    open: true,
    port: 5173,
    host: true,
    fs: {
      allow: ['./src'],
    },
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 4173,
    host: true,
  },
})
