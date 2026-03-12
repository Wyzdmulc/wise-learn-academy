import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { BlinkUser } from '@blinkdotnew/sdk'

export function useAuth() {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const login = () => blink.auth.login()
  const logout = () => blink.auth.signOut()

  const isAdmin = user?.role === 'admin' || user?.metadata?.role === 'admin'
  
  // Logic for users older than 10 days to enrich library
  const isEnriched = user?.createdAt 
    ? (new Date().getTime() - new Date(user.createdAt).getTime()) > 10 * 24 * 60 * 60 * 1000 
    : false

  return { 
    user, 
    isLoading, 
    login, 
    logout, 
    isAdmin, 
    isEnriched,
    isAuthenticated: !!user 
  }
}
