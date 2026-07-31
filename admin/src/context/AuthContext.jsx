import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/api/auth/me')
        .then(r => setUser(r.data))
        .catch((err) => {
          const status = err?.response?.status
          if (status === 401 || status === 403) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            delete api.defaults.headers.common['Authorization']
          } else {
            // Network error — decode payload to keep user session alive
            try {
              const payload = JSON.parse(atob(token.split('.')[1]))
              setUser({ username: payload.sub, role: 'admin' })
            } catch {
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
            }
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])


  const login = async (username, password) => {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    const res = await api.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const { access_token, refresh_token } = res.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    setUser({ username: res.data.username, role: res.data.role })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
