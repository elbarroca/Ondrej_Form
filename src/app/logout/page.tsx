"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"

export default function LogoutPage() {
  const router = useRouter()
  const { signOut } = useAuth()

  useEffect(() => {
    async function logout() {
      await signOut()
      router.push("/")
    }
    logout()
  }, [signOut, router])

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Signing out...</p>
      </div>
    </div>
  )
}