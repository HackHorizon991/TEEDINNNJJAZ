import type React from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <div className="w-[200px] min-w-[200px] flex-shrink-0 bg-[#006ce3]">
          <DashboardSidebar />
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
