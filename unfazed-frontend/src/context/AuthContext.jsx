import { useEffect, useState } from 'react'
import AuthContext from './authContext'
import api from '../services/api'

const readStoredAuth = () => {
  const storedAuth = localStorage.getItem('unfazed-auth')
  if (!storedAuth) return { token: '', user: null }

  try {
    const auth = JSON.parse(storedAuth)
    if (auth && typeof auth.token === 'string' && auth.token && auth.user) return auth
    localStorage.removeItem('unfazed-auth')
    return { token: '', user: null }
  } catch {
    localStorage.removeItem('unfazed-auth')
    return { token: '', user: null }
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth)
  const [loading, setLoading] = useState(Boolean(auth.token))

  useEffect(() => {
    if (!auth.token) return
    let active = true

    api.get('/users/me')
      .then(({ data }) => {
        if (!active) return
        const nextAuth = { token: auth.token, user: data.user }
        localStorage.setItem('unfazed-auth', JSON.stringify(nextAuth))
        setAuth(nextAuth)
      })
      .catch((error) => {
        if (active && error.response?.status === 401) {
          localStorage.removeItem('unfazed-auth')
          setAuth({ token: '', user: null })
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [auth.token])

  const authenticate = async (action, credentials, expectedRole) => {
    const { data } = await api.post(`/users/${action}`, credentials)
    if (!data.success) {
      throw new Error(data.message || 'Authentication failed')
    }

    localStorage.setItem('unfazed-auth', JSON.stringify({ token: data.token, user: data.user }))
    let profile
    try {
      const response = await api.get('/users/me')
      profile = response.data.user
    } catch (error) {
      localStorage.removeItem('unfazed-auth')
      throw error
    }
    if (expectedRole && profile.role !== expectedRole) {
      localStorage.removeItem('unfazed-auth')
      throw new Error(`This account is registered as a ${profile.role}. Choose ${profile.role} to sign in.`)
    }

    const authenticatedUser = { token: data.token, user: profile }
    localStorage.setItem('unfazed-auth', JSON.stringify(authenticatedUser))
    setAuth(authenticatedUser)
    return profile
  }

  const updateProfile = async (updates) => {
    const { data } = await api.patch('/users/me', updates)
    const nextAuth = { ...auth, user: data.user }
    localStorage.setItem('unfazed-auth', JSON.stringify(nextAuth))
    setAuth(nextAuth)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('unfazed-auth')
    setAuth({ token: '', user: null })
  }

  const value = {
    token: auth.token,
    user: auth.user,
    loading,
    login: (credentials, role) => authenticate('login', credentials, role),
    register: (credentials) => authenticate('register', credentials),
    updateProfile,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
