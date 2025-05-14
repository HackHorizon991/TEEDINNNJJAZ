"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RegisterDrawer } from "@/components/register-drawer"
import { ForgotPasswordDrawer } from "@/components/forgot-password-drawer"
import { useAuth } from "@/contexts/auth-context"

interface LoginDrawerProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: () => void
}

export function LoginDrawer({ isOpen, onClose, onLoginSuccess }: LoginDrawerProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Reset click count when drawer is closed
  useEffect(() => {
    if (!isOpen) {
      setClickCount(0)
      setError("")
      setIsLoading(false)
    }
  }, [isOpen])

  // Import useAuth here
  const { login: authLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Increment click counter for quick login (dev feature)
    const newCount = clickCount + 1
    setClickCount(newCount)

    // Check if we've reached 7 clicks for quick login (dev feature)
    if (newCount >= 7) {
      console.log("Quick login activated!")
      // Call login success callback
      if (onLoginSuccess) {
        onLoginSuccess()
      }
      // Close the drawer
      onClose()
      setIsLoading(false)
      return
    }

    // Validate input
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน")
      setIsLoading(false)
      return
    }

    // Normal login logic with Supabase
    try {
      const { error } = await authLogin(email, password)

      if (error) {
        console.error("Login error:", error.message)
        setError(error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
        setIsLoading(false)
        return
      }

      console.log("Login successful")

      // Call login success callback
      if (onLoginSuccess) {
        onLoginSuccess()
      }

      // Close the drawer
      onClose()
      setIsLoading(false)
    } catch (error) {
      console.error("Login exception:", error)
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
      setIsLoading(false)
    }
  }

  // Calculate progress for visual feedback
  const progressPercentage = (clickCount / 7) * 100

  return (
    <>
      {/* Overlay */}
      {isOpen && !showRegister && !showForgot && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} aria-hidden="true"></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white z-[60] transform transition-transform duration-300 ease-in-out ${isOpen && !showRegister && !showForgot ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ marginTop: 0, paddingTop: 0 }}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-end">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 mt-8">
            <h2 className="text-3xl font-bold mb-8">ล็อกอิน เข้าสู่ระบบ</h2>

            {/* Quick login progress indicator (only visible after first click) */}
            {clickCount > 0 && (
              <div className="mb-4">
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">{clickCount}/7 คลิก</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-lg"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 text-lg"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      จดจำฉันในระบบ
                    </Label>
                  </div>

                  <button
                    type="button"
                    className="text-blue-500 text-sm hover:underline"
                    onClick={() => setShowForgot(true)}
                    disabled={isLoading}
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <Button
                  type="submit"
                  className={`w-full h-14 text-lg ${clickCount >= 6 ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังดำเนินการ..." : (clickCount >= 6 ? "คลิกอีกครั้งเพื่อเข้าสู่ระบบ" : "ยืนยัน")}
                </Button>
              </div>
            </form>

            <div className="relative flex items-center my-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">หรือ</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 text-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-800"
                disabled={isLoading}
              >
                <Image
                  src="/icons/google.png"
                  alt="Google"
                  width={24}
                  height={24}
                  style={{ width: 'auto', height: '24px' }}
                  className="mr-2"
                />
                Sign in with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-14 text-lg bg-[#06C755] hover:bg-[#05B54A] text-white"
                disabled={isLoading}
              >
                <Image
                  src="/icons/line.jpg"
                  alt="LINE"
                  width={24}
                  height={24}
                  style={{ width: 'auto', height: '24px' }}
                  className="mr-2"
                />
                Sign in with LINE
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-14 text-lg bg-[#1877F2] hover:bg-[#166FE5] text-white"
                disabled={isLoading}
              >
                <Image
                  src="/icons/facebook1.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  style={{ width: 'auto', height: '24px' }}
                  className="mr-2"
                />
                Sign in with Facebook
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p>
                คุณยังไม่มีบัญชีใช่ไหม?{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setShowRegister(true)}
                  disabled={isLoading}
                >
                  สมัครสมาชิก
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <RegisterDrawer
        isOpen={isOpen && showRegister}
        onClose={() => {
          setShowRegister(false)
          onClose()
        }}
        onSwitchToLogin={() => setShowRegister(false)}
      />
      <ForgotPasswordDrawer
        isOpen={isOpen && showForgot}
        onClose={() => setShowForgot(false)}
      />
    </>
  )
}
