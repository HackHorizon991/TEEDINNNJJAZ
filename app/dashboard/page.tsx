"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { isLoggedIn, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn && userRole) {
      switch (userRole) {
        case 'customer':
          router.push('/dashboard/customer')
          break
        case 'agent':
          router.push('/dashboard/agent')
          break
        case 'superAdmin':
          router.push('/dashboard/super-admin')
          break
      }
    }
  }, [isLoggedIn, userRole, router])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">แดชบอร์ด</h1>

      {!isLoggedIn ? (
        <Card>
          <CardHeader>
            <CardTitle>กรุณาเข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">คุณยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบเพื่อใช้งานแดชบอร์ด</p>
            <Button onClick={() => router.push('/')}>กลับสู่หน้าหลัก</Button>
          </CardContent>
        </Card>
      ) : !userRole ? (
        <Card>
          <CardHeader>
            <CardTitle>กำลังตรวจสอบข้อมูลผู้ใช้...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>กรุณารอสักครู่ระบบกำลังนำท่านไปยังแดชบอร์ดที่เหมาะสม</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
