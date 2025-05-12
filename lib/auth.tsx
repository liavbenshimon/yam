"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { getManagerById, type Manager } from "./managers-data"
import { useRouter } from "next/navigation"
import { getCookie, setCookie, deleteCookie } from "cookies-next"

interface AuthContextType {
  manager: Manager | null
  login: (managerId: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [manager, setManager] = useState<Manager | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // בדיקה אם יש מנהל מחובר בעת טעינת האפליקציה
    const managerId = getCookie("managerId")
    if (managerId) {
      const foundManager = getManagerById(managerId.toString())
      if (foundManager) {
        setManager(foundManager)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (managerId: string): Promise<boolean> => {
    const foundManager = getManagerById(managerId)
    if (foundManager) {
      setManager(foundManager)
      setCookie("managerId", managerId, { maxAge: 60 * 60 * 24 }) // תוקף ל-24 שעות
      return true
    }
    return false
  }

  const logout = () => {
    setManager(null)
    deleteCookie("managerId")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ manager, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useRequireAuth() {
  const { manager, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !manager) {
      router.push("/login")
    }
  }, [manager, isLoading, router])

  return { manager, isLoading }
}
