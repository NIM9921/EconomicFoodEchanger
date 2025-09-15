import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    https: {
      key: fs.readFileSync('/home/ec2-user/ssl/dev.key'),
      cert: fs.readFileSync('/home/ec2-user/ssl/dev.crt'),
    },
    allowedHosts: [
      'ae9d-101-2-191-170.ngrok-free.app' // Add your ngrok domain here
    ]
  },
})


