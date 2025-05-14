"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface LogoutConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutConfirmationModal({ isOpen, onClose }: LogoutConfirmationModalProps) {
  const router = useRouter()

  if (!isOpen) return null;
  
  const { logout: authLogout } = useAuth()
  
  const handleLogout = async () => {
    try {
      // ออกจากระบบผ่าน AuthContext ที่เชื่อมต่อกับ Supabase
      await authLogout()
      
      // ล้าง localStorage เพื่อออกจากระบบ (ส่วนนี้อาจไม่จำเป็นถ้า AuthContext ทำงานถูกต้อง)
      localStorage.setItem("isLoggedIn", "false")
      localStorage.removeItem("userRole")

      // Redirect to home page
      router.push("/")
      // รีโหลดหน้าเว็บเพื่อให้การเปลี่ยนแปลงมีผล
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md p-6 flex flex-col items-center">
          {/* Gray circle icon */}
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-6"></div>

          {/* Confirmation text */}
          <h2 className="text-2xl font-bold mb-8 text-center">ต้องการออกจากระบบ?</h2>

          {/* Buttons */}
          <div className="w-full space-y-3">
            <Button onClick={handleLogout} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-md">
              ยืนยัน
            </Button>

            <Button onClick={onClose} variant="outline" className="w-full border-gray-300 text-black py-3 rounded-md">
              ย้อนกลับ
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
