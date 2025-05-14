"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { OtpDrawer } from "@/components/otp-drawer"
import { TermsModal } from "@/components/terms-modal"
import { supabase } from "@/lib/supabase"

interface RegisterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterDrawer({ isOpen, onClose, onSwitchToLogin }: RegisterDrawerProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState("")
  const [showOtpDrawer, setShowOtpDrawer] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Reset all fields
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      setPassword("")
      setConfirmPassword("")
      setAgree(false)
      setError("")
      setShowOtpDrawer(false)
      setShowTermsModal(false)
      setIsLoading(false)
    } else {
      // Delay unmount for animation
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    // รูปแบบเบอร์โทรศัพท์ไทย เช่น 08x-xxx-xxxx หรือ 08xxxxxxxx
    const phoneRegex = /^(0[689]{1}[0-9]{8}|0[689]{1}-[0-9]{3}-[0-9]{4})$/
    return phoneRegex.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Basic validation
      if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        setError("กรุณากรอกข้อมูลให้ครบถ้วน")
        setIsLoading(false)
        return
      }

      if (!validateEmail(email)) {
        setError("รูปแบบอีเมลไม่ถูกต้อง")
        setIsLoading(false)
        return
      }

      if (!validatePhone(phone)) {
        setError("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678 หรือ 081-234-5678)")
        setIsLoading(false)
        return
      }

      if (password.length < 8) {
        setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError("รหัสผ่านไม่ตรงกัน")
        setIsLoading(false)
        return
      }

      if (!agree) {
        setError("กรุณายอมรับเงื่อนไขและข้อตกลง")
        setIsLoading(false)
        return
      }

      // สร้างผู้ใช้ใหม่ด้วย Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            role: 'customer'
          }
        }
      })

      if (authError) {
        console.error("Registration error:", authError.message)
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (!authData?.user?.id) {
        setError("ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง")
        setIsLoading(false)
        return
      }

      // เพิ่มข้อมูลในตาราง users
      const { error: usersError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          role: 'customer',
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          password: password // ในระบบจริงไม่ควรเก็บรหัสผ่านแบบ plain text
        })

      if (usersError) {
        console.error("Users table insert error:", usersError.message)
        setError("เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้")
        setIsLoading(false)
        return
      }

      // สำเร็จ
      setError("")
      setIsLoading(false)

      // ส่ง OTP
      setSuccessMessage("ลงทะเบียนสำเร็จ! กรุณายืนยัน OTP เพื่อเข้าสู่ระบบ")
      setShowOtpDrawer(true)
    } catch (error: any) {
      console.error("Registration exception:", error)
      setError(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน")
      setIsLoading(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" aria-hidden="true"></div>
      )}
      <TermsModal
        isOpen={showTermsModal}
        onAccept={() => {
          setShowTermsModal(false)
          setAgree(true)
        }}
        onClose={() => setShowTermsModal(false)}
      />
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 transition-all duration-300 ease-in-out animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center max-w-md w-full mx-4 transition-all duration-300 ease-in-out scale-100 opacity-100">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#10B981" />
                <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-green-700 mb-2 text-center">ลงทะเบียนสำเร็จ!</div>
            <div className="text-gray-600 mb-6 text-center">
              {successMessage}
            </div>
            <Button
              className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white"
              onClick={() => {
                setShowSuccessModal(false);
                onClose();
                onSwitchToLogin();
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </div>
        </div>
      )}
      {!showTermsModal && !showSuccessModal && (
        <>
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white z-[60] transform transition-all duration-300 ease-in-out
              ${isOpen && isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
            style={{ marginTop: 0, paddingTop: 0 }}
          >
            <div className="h-full flex flex-col p-6 overflow-y-auto">
              <div className="flex justify-end">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" disabled={isLoading}>
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 mt-4">
                <h2 className="text-3xl font-bold mb-6">ลงทะเบียนใช้งาน</h2>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">ชื่อ</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="กรอกชื่อ"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="h-12 text-lg"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">นามสกุล</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="กรอกนามสกุล"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="h-12 text-lg"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">อีเมล</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Example@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-12 text-lg"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">เบอร์โทร</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="081-111-1111"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="h-12 text-lg"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">รหัสผ่าน</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="อย่างน้อย 8 ตัวอักษร"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="h-12 text-lg"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="อย่างน้อย 8 ตัวอักษร"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="h-12 text-lg"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="agree"
                        checked={agree}
                        onCheckedChange={checked => setAgree(checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="agree" className="text-xs text-gray-600">
                        ยอมรับ <button type="button" className="text-blue-500 hover:underline" onClick={() => setShowTermsModal(true)}>ข้อกำหนดเเละนโยบายความเป็นส่วนตัว</button> ทั้งหมด
                      </Label>
                    </div>

                    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

                    <Button
                      type="submit"
                      className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600 text-white mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "กำลังดำเนินการ..." : "ยืนยัน"}
                    </Button>
                  </div>
                </form>

                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-600">หรือ</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-lg bg-blue-100 hover:bg-blue-200 text-black flex items-center justify-center"
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
                    className="w-full h-12 text-lg bg-green-100 hover:bg-green-200 text-black flex items-center justify-center"
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
                    className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
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
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-lg bg-gray-100 hover:bg-gray-200 text-black flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <Image
                      src="/icons/phone.jpg"
                      alt="Phone"
                      width={24}
                      height={24}
                      style={{ width: 'auto', height: '24px' }}
                      className="mr-2"
                    />
                    Sign in with Phone
                  </Button>
                </div>

                <div className="mt-8 text-center">
                  <p>
                    มีบัญชีอยู่แล้ว?{' '}
                    <button
                      type="button"
                      className="text-blue-500 hover:underline"
                      onClick={onSwitchToLogin}
                      disabled={isLoading}
                    >
                      เข้าสู่ระบบ
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <OtpDrawer
            isOpen={showOtpDrawer}
            phone={phone}
            onClose={() => {
              setShowOtpDrawer(false)
            }}
            onSuccess={() => {
              setShowOtpDrawer(false);
              onClose(); // ปิด RegisterDrawer
              onSwitchToLogin(); // เปิด LoginDrawer
            }}
          />
        </>
      )}
    </>
  )
}
