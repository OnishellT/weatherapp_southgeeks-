import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import daisyui from 'daisyui'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
        theme: {
          extend: {},
        },
        plugins: [daisyui],
        daisyui: {
          themes: ['light', 'dark', 'cupcake'],
        },
      },
    }),
  ],
})