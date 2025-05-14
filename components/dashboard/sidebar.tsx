"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, User, FileText, Heart, Bell, LogOut } from "lucide-react"
import { useState } from "react"
import { LogoutConfirmationModal } from "@/components/logout-confirmation-modal"

interface MenuItem {
  title: string
  icon: React.ElementType
  href: string
  onClick?: () => void
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const menuItems: MenuItem[] = [
    {
      title: "แดชบอร์ด",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "บัญชีของฉัน",
      icon: User,
      href: "/dashboard/account",
    },
    {
      title: "ประกาศของฉัน",
      icon: FileText,
      href: "/dashboard/listings",
    },
    {
      title: "รายการที่สนใจ",
      icon: Heart,
      href: "/dashboard/favorites",
    },
    {
      title: "แจ้งเตือน",
      icon: Bell,
      href: "/dashboard/notifications",
    },
    {
      title: "ออกจากระบบ",
      icon: LogOut,
      href: "#",
      onClick: () => setIsLogoutModalOpen(true),
    },
  ]

  return (
    <div className="text-white h-[calc(100vh-56px)] w-full">
      <nav className="py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`flex items-center px-4 py-3 text-sm w-full text-left ${
                      isActive ? "bg-blue-700 font-medium" : "hover:bg-blue-700"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.title}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm ${
                      isActive ? "bg-blue-700 font-medium" : "hover:bg-blue-700"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
      <LogoutConfirmationModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </div>
  )
}
