"use client"

import React, { createContext, useState, useContext, useEffect } from "react"
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

// User types
export type UserRole = 'customer' | 'agent' | 'admin'

interface AuthContextType {
  isLoggedIn: boolean
  userRole: UserRole | null
  setIsLoggedIn: (value: boolean) => void
  setUserRole: (role: UserRole | null) => void
  login: (email: string, password: string) => Promise<{ error: any | null }>
  loginWithOtp: (phone: string) => Promise<{ error: any | null }>
  verifyOtp: (phone: string, otp: string) => Promise<{ error: any | null }>
  logout: () => Promise<void>
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userRole: null,
  setIsLoggedIn: () => { },
  setUserRole: () => { },
  login: async () => ({ error: null }),
  loginWithOtp: async () => ({ error: null }),
  verifyOtp: async () => ({ error: null }),
  logout: async () => { },
  user: null,
  session: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Check Supabase session and localStorage on client side only
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // Check if we have a session
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user ?? null)

        if (data.session?.user) {
          // Get user role from metadata or profile
          const storedUserRole = localStorage.getItem("userRole") as UserRole | null
          setUserRole(storedUserRole)
          setIsLoggedIn(true)
        } else {
          // No session, check localStorage as backup
          const userLoggedIn = localStorage.getItem("isLoggedIn") === "true"
          const storedUserRole = localStorage.getItem("userRole") as UserRole | null

          setIsLoggedIn(userLoggedIn)
          setUserRole(storedUserRole)
        }
      } catch (error) {
        console.error("Error getting auth status:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          // Get user role from metadata or profile
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
          setUserRole(null)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Login function using Supabase
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (!error && data.user) {
        // Determine user role (from metadata or separate query)
        const role = 'customer' as UserRole // Default role, change as needed

        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userRole", role)
        setIsLoggedIn(true)
        setUserRole(role)
      }

      return { error }
    } catch (error) {
      console.error("Login error:", error)
      return { error }
    }
  }

  // Login with OTP function
  const loginWithOtp = async (phone: string) => {
    try {
      // ในกรณีจริงควรใช้ Supabase Auth ส่ง OTP
      // แต่ในตัวอย่างนี้เราจะจำลองการส่ง OTP

      // สำหรับ Supabase จริงๆ จะใช้ signInWithOtp
      // const { data, error } = await supabase.auth.signInWithOtp({
      //   phone: phone,
      // })

      // จำลองการส่ง OTP สำเร็จ
      console.log(`Sending OTP to phone: ${phone}`)

      return { error: null }
    } catch (error) {
      console.error("OTP request error:", error)
      return { error }
    }
  }

  // Verify OTP function
  const verifyOtp = async (phone: string, otp: string) => {
    try {
      // ในกรณีจริงควรใช้ Supabase Auth ยืนยัน OTP
      // แต่ในตัวอย่างนี้เราจะจำลองการยืนยัน OTP

      // สำหรับ Supabase จริงๆ จะใช้ verifyOtp
      // const { data, error } = await supabase.auth.verifyOtp({
      //   phone: phone,
      //   token: otp,
      //   type: 'sms'
      // })

      // จำลองการยืนยัน OTP สำเร็จ
      console.log(`Verifying OTP for phone: ${phone} with code: ${otp}`)

      // จำลองการล็อกอินสำเร็จ
      const role = 'customer' as UserRole
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userRole", role)
      setIsLoggedIn(true)
      setUserRole(role)

      return { error: null }
    } catch (error) {
      console.error("OTP verification error:", error)
      return { error }
    }
  }

  // Logout function using Supabase
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("userRole")
      setIsLoggedIn(false)
      setUserRole(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userRole,
      setIsLoggedIn,
      setUserRole,
      login,
      loginWithOtp,
      verifyOtp,
      logout,
      user,
      session,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
