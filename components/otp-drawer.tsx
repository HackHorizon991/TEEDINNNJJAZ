"use client"

import React, { useState, useRef, useEffect } from "react"
import { X, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

interface OtpDrawerProps {
  isOpen: boolean
  onClose: () => void
  phone: string
  onSuccess?: () => void // เพิ่ม prop สำหรับ callback สำเร็จ
}

export function OtpDrawer({ isOpen, onClose, phone, onSuccess }: OtpDrawerProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const codeRefs = useRef<(HTMLInputElement | null)[]>([])
  const [isVisible, setIsVisible] = useState(false);
  const { verifyOtp } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setOtp("");
      setError("");
      setIsLoading(false);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("กรุณากรอกรหัส OTP 6 หลัก")
      return
    }

    setIsLoading(true);
    setError("");

    try {
      // ยืนยัน OTP กับ Supabase
      const { error } = await verifyOtp(phone, otp);

      if (error) {
        setError(error.message || "รหัส OTP ไม่ถูกต้อง");
        setIsLoading(false);
        return;
      }

      // ถ้าสำเร็จ
      setShowSuccessModal(true);
      setIsLoading(false);

      // เรียก callback สำเร็จ (ถ้ามี)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000); // รอให้แสดง success modal สักครู่
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการยืนยัน OTP");
      setIsLoading(false);
    }
  }

  // ส่ง OTP ใหม่
  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      // จำลองการส่ง OTP ใหม่
      console.log(`Resending OTP to phone: ${phone}`);

      // รอสักครู่เพื่อจำลองการส่ง
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoading(false);
      // แสดงข้อความสำเร็จ
      setError("ส่งรหัส OTP ใหม่เรียบร้อยแล้ว");
      setTimeout(() => setError(""), 3000);
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("เกิดข้อผิดพลาดในการส่งรหัส OTP ใหม่");
      setIsLoading(false);
    }
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
              <button onClick={onClose} className="p-2 mr-2 rounded-full hover:bg-gray-100">
                <ChevronLeft size={28} />
              </button>
              <span className="text-base text-blue-900 font-medium">ย้อนกลับ</span>
            </div>
            <div className="flex-1 flex flex-col items-center w-full">
              <h2 className="text-3xl font-bold mb-2 w-full text-left">ยืนยันรหัส OTP</h2>
              <div className="mb-8 w-full text-left text-gray-500 text-base">
                รหัสยืนยันได้ถูกส่งไปยังเบอร์โทรศัพท์ {phone ? phone : "ของคุณ"} แล้ว
              </div>
              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                <div className="flex justify-center gap-4 mb-10 w-full">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <Input
                      key={i}
                      maxLength={1}
                      className={`w-16 h-16 text-center text-3xl border-2 rounded-2xl font-bold text-blue-600 bg-white ${typeof window !== 'undefined' && window.document.activeElement === codeRefs.current[i] ? 'border-blue-500' : 'border-blue-300'}`}
                      value={otp[i] || ''}
                      onChange={e => {
                        let val = e.target.value.replace(/[^0-9]/g, '')
                        let arr = otp.split("")
                        arr[i] = val
                        setOtp(arr.join("").slice(0, 6))
                        if (val && codeRefs.current[i + 1]) codeRefs.current[i + 1]?.focus()
                      }}
                      ref={el => { codeRefs.current[i] = el }}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !otp[i] && codeRefs.current[i - 1]) codeRefs.current[i - 1]?.focus()
                      }}
                      autoFocus={i === 0}
                      disabled={isLoading}
                    />
                  ))}
                </div>
                {error && <div className={`text-sm mb-2 ${error.includes("สำเร็จ") || error.includes("เรียบร้อย") ? "text-green-500" : "text-red-500"}`}>{error}</div>}
                <Button
                  type="submit"
                  className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังดำเนินการ..." : "ยืนยัน"}
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-gray-500">
                    ไม่ได้รับรหัส?{" "}
                    <button
                      type="button"
                      className="text-blue-500 hover:underline"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                    >
                      ส่งรหัสใหม่อีกครั้ง
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 transition-all duration-300 ease-in-out animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center max-w-md w-full mx-4 transition-all duration-300 ease-in-out scale-100 opacity-100">
            <div className="rounded-full bg-blue-100 p-4 mb-4">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#3B82F6" />
                <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-2 text-center">ยืนยันตัวตนสำเร็จ!</div>
            <div className="text-gray-600 mb-6 text-center">
              ยินดีด้วยคุณได้ยืนยันตัวตนสำเร็จแล้ว<br />
              คลิกปุ่มยืนยันเพื่อกลับเข้าสู่เว็บไซต์
            </div>
            <Button
              className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                setShowSuccessModal(false);
                onClose();
                if (onSuccess) onSuccess();
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
