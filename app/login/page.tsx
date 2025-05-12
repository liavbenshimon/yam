"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function LoginPage() {
  const [managerId, setManagerId] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!managerId.trim()) {
      setError("נא להזין מספר זיהוי")
      return
    }

    const success = await login(managerId)
    if (success) {
      router.push("/")
    } else {
      setError("מספר זיהוי שגוי. נא לנסות שוב.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DBD3D3]/20" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#091057] text-white p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-lg">
              <Image src="/yamot-logo.png" alt="YAMOT Logo" width={150} height={100} priority />
            </div>
          </div>
          <h1 className="text-2xl font-bold">ים ניהול ואחזקה</h1>
          <p className="mt-2 text-[#EC8305]">כניסה למערכת</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="managerId">מספר זיהוי מנהל:</Label>
            <Input
              id="managerId"
              type="text"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              placeholder="הזן את מספר הזיהוי שלך"
              className="text-lg text-center tracking-wider"
              dir="ltr"
            />
          </div>

          {error && <div className="text-red-500 text-center">{error}</div>}

          <Button type="submit" className="w-full bg-[#024CAA] hover:bg-[#024CAA]/90">
            התחבר
          </Button>
        </form>
      </div>
    </div>
  )
}
