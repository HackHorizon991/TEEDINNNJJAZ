"use client"

import { useState, useEffect } from "react"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LoginDrawer } from "@/components/login-drawer"
import { PropertyListingModal } from "@/components/property-listing-modal"
import { useAuth } from "@/contexts/auth-context"

interface HeroSectionProps {
  activeFilter: string | null
  onFilterChange: (filter: string | null) => void
}

export function HeroSection({ activeFilter, onFilterChange }: HeroSectionProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isListingModalOpen, setIsListingModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Check if user is logged in from localStorage (client-side only)
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(userLoggedIn)
  }, [])

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/hero-background.jpg" alt="Bangkok skyline" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-teal-900/60"></div>
      </div>

      {/* Top Navigation */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white font-bold text-lg">
              TEEDIN EASY
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/buy" className="text-white hover:text-blue-200 text-sm">
                ซื้อ
              </Link>
              <Link href="/rent" className="text-white hover:text-blue-200 text-sm">
                เช่า
              </Link>
                  <Link href="/sell" className="text-white hover:text-blue-200 text-sm">
                    ขาย
                  </Link>
                  <Link href="/real-estate" className="text-white hover:text-blue-200 text-sm">
                    อสังหาริมทรัพย์
                  </Link>
                  <Link href="/new-real-estate" className="text-white hover:text-blue-200 text-sm">
                    อสังหาใหม่
                  </Link>                  <Link href="/new-projects" className="text-white hover:text-blue-200 text-sm">
                    โครงการใหม่
                  </Link>
                  <button onClick={() => setIsListingModalOpen(true)} className="text-white hover:text-blue-200 text-sm">
                    ลงประกาศ
                  </button>
                  {isLoggedIn && (
                    <Link href="/dashboard/agent" className="text-white hover:text-blue-200 text-sm">
                      Agent
                    </Link>
                  )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <button className="text-white">
                <Bell size={20} />
              </button>
            )}            <div className="relative">
              <button className="flex items-center text-white bg-transparent border border-white/30 rounded-md px-3 py-1">
                <span className="mr-1">ภาษาไทย</span>
                <ChevronDown size={16} />
              </button>
            </div>
            
            {isLoggedIn ? (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  window.location.href = "/dashboard"
                }}
              >
                โปรไฟล์
              </Button>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={() => setIsLoginOpen(true)}
              >
                เข้าสู่ระบบ
              </Button>
            )}
          </div>
        </div>
      </div>      {/* Search Section */}
      <div className="relative z-10 pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex mb-4 bg-white/10 backdrop-blur-sm rounded-t-lg overflow-hidden overflow-x-auto">
            <FilterTab label="ซื้อ" isActive={activeFilter === "buy"} onClick={() => onFilterChange("buy")} />
            <FilterTab label="เช่า" isActive={activeFilter === "rent"} onClick={() => onFilterChange("rent")} />
            
            {isLoggedIn && (
              <>
                <FilterTab label="ขาย" isActive={activeFilter === "sell"} onClick={() => onFilterChange("sell")} />
                <FilterTab
                  label="ใกล้ BTS"
                  isActive={activeFilter === "near-bts"}
                  onClick={() => onFilterChange("near-bts")}
                />
                <FilterTab
                  label="ใกล้รถไฟฟ้าสายสีแดง"
                  isActive={activeFilter === "near-red-line"}
                  onClick={() => onFilterChange("near-red-line")}
                />
                <FilterTab
                  label="ใกล้มหาวิทยาลัย"
                  isActive={activeFilter === "near-university"}
                  onClick={() => onFilterChange("near-university")}
                />
              </>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex">
            <input
              type="text"
              placeholder="ค้นหาโครงการ รถไฟฟ้า เขต"
              className="flex-grow py-4 px-6 rounded-l-md focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-r-md flex items-center justify-center">
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>      {/* Login Drawer */}
      <LoginDrawer 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={() => {
          setIsLoggedIn(true)
          localStorage.setItem("isLoggedIn", "true")
        }} 
      />

      {/* Property Listing Modal */}
      <PropertyListingModal isOpen={isListingModalOpen} onClose={() => setIsListingModalOpen(false)} />
    </div>
  )
}

interface FilterTabProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function FilterTab({ label, isActive, onClick }: FilterTabProps) {
  return (
    <button
      className={`px-6 py-3 whitespace-nowrap ${isActive ? "bg-blue-600 text-white" : "text-white hover:bg-white/10"}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
