import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0', // Allow access from network
        port: 5173,
        allowedHosts: [
            'ae9d-101-2-191-170.ngrok-free.app' // Add your ngrok domain here
        ]
    }
})