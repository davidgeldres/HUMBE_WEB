import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/ - Server Restart Triggered
export default defineConfig({
  plugins: [react()],
})
