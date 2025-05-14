"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const [activeImage, setActiveImage] = useState(0)

  // Mock property data - in a real app, this would be fetched based on the ID
  const property = {
    id: params.id,
    name: "SKYLINE CONDO",
    price: "1,000,000 บาท",
    area: "850 ตร.ม.",
    location: "สุขุมวิท - กรุงเทพฯ",
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    description:
      "คอนโดมิเนียมหรูใจกลางเมือง ใกล้รถไฟฟ้า BTS สถานีอโศก เพียง 300 เมตร วิวสวยทิวทัศน์เมือง พร้อมสิ่งอำนวยความสะดวกครบครัน",
    highlights: [
      "ใกล้รถไฟฟ้า BTS สถานีอโศก เพียง 300 เมตร",
      "วิวสวยทิวทัศน์เมือง ไม่บล็อกวิว",
      "สิ่งอำนวยความสะดวกครบครัน สระว่ายน้ำ ฟิตเนส",
      "ระบบรักษาความปลอดภัย 24 ชั่วโมง",
      "ที่จอดรถสะดวกสบาย",
    ],
    images: [
      "/property-detail/condo1.jpg",
      "/property-detail/condo2.jpg",
      "/property-detail/condo3.jpg",
      "/property-detail/condo4.jpg",
      "/property-detail/condo5.jpg",
    ],
    agent: {
      name: "ชื่อเอเจ้นท์",
      image: "/agent-avatar.png",
      title: "ตัวแทนทรัพย์สิน",
    },
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Back Button */}
      <div className="container mx-auto p-4">
        <Link href="/" className="flex items-center text-gray-800 mb-4">
          <ArrowLeft className="mr-2" size={20} />
          <span>ย้อนกลับ</span>
        </Link>
      </div>

      {/* Property Gallery */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={property.images[activeImage] || "/placeholder.svg"}
                alt={property.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {property.images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative h-[195px] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setActiveImage(index + 1)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${property.name} image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Title and Actions */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{property.name}</h1>
          <div className="flex space-x-4">
            <button className="text-gray-800">
              <Heart size={24} />
            </button>
            <button className="text-gray-800">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Property Price */}
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-xl">
          ราคา : <span className="text-2xl font-bold">{property.price}</span>
        </h2>
      </div>

      {/* Property Area */}
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-lg mb-2">พื้นที่ใช้สอย</h3>
        <p>{property.area}</p>
      </div>

      {/* Property Highlights */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">จุดเด่นอสังหาฯ</h3>
          <Button variant="link" className="text-blue-500 flex items-center">
            ดูทั้งหมด
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        <ul className="space-y-2">
          {property.highlights.slice(0, 3).map((highlight, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* About Property */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">เกี่ยวกับอสังหาฯ</h3>
          <Button variant="link" className="text-blue-500 flex items-center">
            ดูทั้งหมด
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        <p className="text-gray-600">{property.description}</p>
      </div>

      {/* Property Location */}
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-xl font-medium mb-4">ที่ตั้งอสังหาฯ</h3>
        <div className="relative h-[300px] rounded-lg overflow-hidden">
          <Image src="/property-map.jpg" alt="Property location map" fill className="object-cover" />
        </div>
      </div>

      {/* Contact Agent Sidebar - Fixed on desktop, bottom sheet on mobile */}
      <div className="fixed bottom-0 right-0 md:top-40 md:bottom-auto md:right-4 w-full md:w-72 bg-blue-600 text-white rounded-t-lg md:rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-center text-lg font-medium mb-4">สอบถามเกี่ยวกับทรัพย์สิน</h3>
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-300 mb-2 overflow-hidden relative">
              <Image src="/agent-avatar.png" alt={property.agent.name} fill className="object-cover" />
            </div>
            <p className="text-sm">{property.agent.name}</p>
            <p className="text-sm text-gray-100">{property.agent.title}</p>
          </div>
          <div className="space-y-3">
            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">นัดชมทรัพย์สิน</Button>
            <Button variant="outline" className="w-full border-white text-white hover:bg-blue-700">
              ขอใบเสนอราคา
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
