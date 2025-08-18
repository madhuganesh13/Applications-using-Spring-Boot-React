import axios from 'axios'

const client = axios.create({
baseURL: import.meta.env.VITE_API_BASE || '/api',
headers: { 'Content-Type': 'application/json' }
})

export default client
