"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PropertyListingModal } from "@/components/property-listing-modal"
import { LogoutConfirmationModal } from "@/components/logout-confirmation-modal"

export function DashboardHeader() {
  const [isListingModalOpen, setIsListingModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  return (
    <>
      <header className="bg-[#006ce3] text-white py-2 px-4 flex items-center justify-between h-14 z-30">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-bold text-lg">
            TEEDIN EASY
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/buy" className="text-white hover:text-blue-200 text-sm">
              ซื้อ
            </Link>
            <Link href="/sell" className="text-white hover:text-blue-200 text-sm">
              ขาย
            </Link>
            <Link href="/rent" className="text-white hover:text-blue-200 text-sm">
              เช่า
            </Link>
            <Link href="/real-estate" className="text-white hover:text-blue-200 text-sm">
              อสังหาริมทรัพย์
            </Link>
            <Link href="/new-real-estate" className="text-white hover:text-blue-200 text-sm">
              อสังหาใหม่
            </Link>
            <Link href="/new-projects" className="text-white hover:text-blue-200 text-sm">
              โครงการใหม่
            </Link>
            <button onClick={() => setIsListingModalOpen(true)} className="text-white hover:text-blue-200 text-sm">
              ลงประกาศ
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/dashboard/notifications" className="text-white">
            <Bell size={20} />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-white/30 text-white bg-transparent hover:bg-blue-700">
                <span className="mr-1">ภาษาไทย</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>ภาษาไทย</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-white/30 text-white bg-transparent hover:bg-blue-700">
                <span className="mr-1">โปรไฟล์</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/dashboard/account" className="w-full">
                  บัญชีของฉัน
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/listings" className="w-full">
                  ประกาศของฉัน
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsLogoutModalOpen(true)
                }}
              >
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <PropertyListingModal isOpen={isListingModalOpen} onClose={() => setIsListingModalOpen(false)} />
      <LogoutConfirmationModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  )
}
