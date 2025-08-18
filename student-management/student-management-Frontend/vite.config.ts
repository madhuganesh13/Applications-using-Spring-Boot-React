import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
server: {
port: 5173,
proxy: {
'/api': 'https://applications-using-spring-boot-react-production-d724.up.railway.app'
}
},
build: {
outDir: 'dist'
}
})
