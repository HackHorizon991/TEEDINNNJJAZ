"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function AccountPage() {
  // Mock user data
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "Example@email.com",
    phone: "081-111-1111",
    password: "••••••••",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Updated user data:", user)
    alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">บัญชีของฉัน</h1>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <p className="mb-4">รูปโปรไฟล์</p>
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                <Image src="/placeholder-avatar.png" alt="Profile" width={128} height={128} className="object-cover" />
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="sr-only">Upload profile picture</span>
              </label>
              <input id="profile-upload" type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ</Label>
              <Input
                id="name"
                placeholder="กรอกชื่อ"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="h-12"
              />
            </div>

            {/* Surname */}
            <div className="space-y-2">
              <Label htmlFor="surname">นามสกุล</Label>
              <Input
                id="surname"
                placeholder="กรอกนามสกุล"
                value={user.surname}
                onChange={(e) => setUser({ ...user, surname: e.target.value })}
                className="h-12"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              placeholder="Example@email.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">เบอร์โทร</Label>
            <Input
              id="phone"
              placeholder="081-111-1111"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              แก้ไขข้อมูล
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
