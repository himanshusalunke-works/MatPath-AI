import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.matpath.ai/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Firebase token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('matpath_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('matpath_token')
      localStorage.removeItem('matpath_user')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api
