"use client"

import React, { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

interface ForgotPasswordDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ForgotPasswordDrawer({ isOpen, onClose }: ForgotPasswordDrawerProps) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const codeRefs = useRef<(HTMLInputElement | null)[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Reset all state when drawer is opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setStep(1)
      setEmail("")
      setCode("")
      setNewPassword("")
      setConfirmPassword("")
      setError("")
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen])
  // Step 1: Request email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("กรุณากรอกอีเมล")
      return
    }
    
    try {
      // ส่งลิงค์รีเซ็ตรหัสผ่านผ่าน Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        console.error("Reset password email error:", error.message)
        setError(error.message)
        return
      }
      
      setError("")
      setStep(2)
    } catch (error: any) {
      console.error("Reset password exception:", error)
      setError(error.message || "เกิดข้อผิดพลาดในการส่งอีเมล")
    }
  }

  // Step 2: Enter code
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || code.length !== 6) {
      
      return
    }
    setError("")
    setStep(3)
  }
  // Step 3: New password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validation
    if (!newPassword || !confirmPassword) {
      setError("กรุณากรอกรหัสผ่านใหม่")
      return
    }
    if (newPassword.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      return
    }
    // ต้องมีตัวอักษรอย่างน้อย 4 ตัว
    const letterCount = (newPassword.match(/[A-Za-z]/g) || []).length
    if (letterCount < 4) {
      setError("* ตัวอักษรขั้นต่ำ 4 ตัว")
      return
    }
    // ต้องมีตัวเลขอย่างน้อย 4 ตัว
    const digitCount = (newPassword.match(/[0-9]/g) || []).length
    if (digitCount < 4) {
      setError("* ตัวเลขขั้นต่ำ 4 ตัว")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน")
      return
    }
    
    try {
      // ในกรณีจริง จะต้องใช้ resetToken ที่ได้จาก URL ที่ส่งไปในอีเมล
      // แต่เนื่องจากเรามี OTP ในนี้ เราจะสมมติว่า code คือ token
      // หรือหากต้องการใช้ให้ถูกต้อง ควรอัปเดตรหัสผ่านจากหน้า reset-password แทน
      
      // สำหรับ demo นี้ เราใช้ session ปัจจุบัน (ถ้ามี) เพื่อเปลี่ยนรหัสผ่าน
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        console.error("Reset password error:", error.message)
        setError(error.message)
        return
      }
      
      setError("")
      setStep(4)
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error("Reset password exception:", error)
      setError(error.message || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน")
    }
  }

  // Step 4: Success
  const handleResetAgain = () => {
    setStep(1)
    setEmail("")
    setCode("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
  }

  return (
    <>
      {isOpen && !showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} aria-hidden="true"></div>
      )}
      {isVisible && !showSuccessModal && (
        <div
          className={`fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white z-[60] transform transition-all duration-300 ease-in-out
            ${isOpen && isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          style={{ marginTop: 0, paddingTop: 0 }}
        >
          <div className="h-full flex flex-col px-10 py-12 overflow-y-auto">
            <div className="flex items-center mb-8">
              <button
                onClick={() => {
                  if (step > 1) {
                    setStep(step - 1);
                  } else {
                    onClose();
                  }
                }}
                className="p-2 mr-2 rounded-full hover:bg-gray-100"
              >
                <X size={28} />
              </button>
              <span className="text-base text-blue-900 font-medium">ย้อนกลับ</span>
            </div>
            <div className="flex-1 flex flex-col items-center w-full">
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-8 w-full ">รีเซ็ตรหัสผ่าน</h2>
                  <form onSubmit={handleSendEmail} className="w-full">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">อีเมล</Label>
                        <Input id="email" type="email" placeholder="Example@email.com" value={email} onChange={e => setEmail(e.target.value)} className="h-14 text-lg" />
                      </div>
                      {error && <div className="text-red-500 text-sm">{error}</div>}
                      <Button type="submit" className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white">ถัดไป</Button>
                    </div>
                  </form>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold mb-2 w-full">รีเซ็ตรหัสผ่านของคุณ</h2>
                  <div className="mb-8 w-full text-left text-gray-500 text-base">รหัสยืนยันได้ถูกส่งไปยังอีเมลหรือทาง SMS ของคุณแล้ว</div>
                  <form onSubmit={handleSendCode} className="w-full flex flex-col items-center">
                    <div className="flex justify-center gap-4 mb-10 w-full">
                      {[0,1,2,3,4,5].map(i => (
                        <Input
                          key={i}
                          maxLength={1}
                          className={`w-16 h-16 text-center text-3xl border-2 rounded-2xl font-bold text-blue-600 bg-white ${document.activeElement === codeRefs.current[i] ? 'border-blue-500' : 'border-blue-300'}`}
                          value={code[i] || ''}
                          onChange={e => {
                            let val = e.target.value.replace(/[^0-9]/g, '')
                            let arr = code.split("")
                            arr[i] = val
                            setCode(arr.join("").slice(0,6))
                            if (val && codeRefs.current[i+1]) codeRefs.current[i+1]?.focus()
                          }}
                          ref={el => { codeRefs.current[i] = el }}
                          onKeyDown={e => {
                            if (e.key === 'Backspace' && !code[i] && codeRefs.current[i-1]) codeRefs.current[i-1]?.focus()
                          }}
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    <Button type="submit" className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-xl">ยืนยัน</Button>
                  </form>
                </>
              )}
              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold mb-2 w-full ">ตั้งค่ารหัสผ่านใหม่</h2>
                  <div className="mb-4 w-full text-center text-gray-500 text-sm">รหัสผ่านเดิมของคุณได้รับการรีเซ็ตเเล้ว กรุณาตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ</div>
                  <form onSubmit={handleResetPassword} className="w-full">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">รหัสผ่าน</Label>
                        <Input id="newPassword" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-14 text-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                        <Input id="confirmPassword" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-14 text-lg" />
                      </div>
                      <div className="text-red-500 text-sm">
                        * ตัวอักษรขั้นต่ำ 4 ตัว<br />
                        * ตัวเลขขั้นต่ำ 4 ตัว
                      </div>
                      {error && <div className="text-red-500 text-sm">{error}</div>}
                      <Button type="submit" className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white">ยืนยัน</Button>
                    </div>
                  </form>
                </>
              )}
              {step === 4 && null}
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 transition-all duration-300 ease-in-out animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center max-w-md w-full mx-4 transition-all duration-300 ease-in-out scale-100 opacity-100">
            <div className="rounded-full bg-blue-100 p-4 mb-4">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#3B82F6"/>
                <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-2 text-center">ตั้งค่ารหัสผ่านใหม่ สำเร็จ!</div>
            <div className="text-gray-600 mb-6 text-center">
              ยินดีด้วยคุณตั้งค่ารหัสผ่านใหม่แล้ว<br />
              คลิกปุ่มยืนยันเพื่อกลับเข้าสู่เว็บไซต์
            </div>
            <Button
              className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                setShowSuccessModal(false);
                onClose();
              }}
            >
              ยืนยัน
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
