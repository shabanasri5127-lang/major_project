import axios from 'axios'
import { addDemoAvatars } from './demoAvatars'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('unfazed-auth')
  if (storedAuth) {
    const { token } = JSON.parse(storedAuth)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use((response) => {
  response.data = addDemoAvatars(response.data)
  return response
})

export default api
