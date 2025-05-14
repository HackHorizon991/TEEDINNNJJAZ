"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, Filter, Heart, Share2 } from "lucide-react"
import Image from "next/image"

// Mock data for user listings
const userListings = [
  {
    id: "listing-1",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/modern-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
  {
    id: "listing-2",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "5,000,000 บาท",
    type: "ขาย",
    image: "/wooden-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
  {
    id: "listing-3",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/apartment-building-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "pending",
    isTopPick: true,
  },
  {
    id: "listing-4",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "5,000,000 บาท",
    type: "ขาย",
    image: "/modern-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
  {
    id: "listing-5",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/wooden-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
  {
    id: "listing-6",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/apartment-building-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
  {
    id: "listing-7",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "5,000,000 บาท",
    type: "ขาย",
    image: "/modern-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
  {
    id: "listing-8",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/wooden-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
  {
    id: "listing-9",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "5,000,000 บาท",
    type: "ขาย",
    image: "/apartment-building-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
  {
    id: "listing-10",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/modern-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    status: "active",
    isTopPick: true,
  },
]

export default function ListingsPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold mb-6">ประกาศของฉัน</h1>

      {/* Search and Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="ค้นหาโครงการ,ราคา"
            className="w-full h-12 pl-4 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-0 top-0 h-full w-16 bg-blue-600 rounded-r-md flex items-center justify-center">
            <Search className="text-white" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button className="h-12 bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} />
            <span>เพิ่มประกาศ</span>
          </Button>
          <Button variant="outline" className="h-12 border-blue-600 text-blue-600 hover:bg-blue-50">
            <Filter size={18} />
            <span className="ml-1">filter</span>
          </Button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            activeFilter === "all" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          ดูทั้งหมด
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeFilter === "negotiate" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
          onClick={() => setActiveFilter("negotiate")}
        >
          ขอต่อรองราคา
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeFilter === "appointment" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
          onClick={() => setActiveFilter("appointment")}
        >
          นัดหมาย
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeFilter === "contract" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
          onClick={() => setActiveFilter("contract")}
        >
          ทำสัญญาแล้ว
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeFilter === "update" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
          onClick={() => setActiveFilter("update")}
        >
          อัพเดททุก 3 เดือน
        </button>
      </div>

      {/* Property Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {userListings.map((listing) => (
          <PropertyCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}

interface PropertyCardProps {
  listing: {
    id: string
    title: string
    location: string
    price: string
    type: string
    image: string
    views: number
    bedrooms: number
    bathrooms: number
    parking: number
    status: string
    isTopPick: boolean
  }
}

function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image src={listing.image || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
        </div>
        <div className="absolute top-3 left-3">
          <span
            className={`px-4 py-1 text-sm font-medium rounded-full text-white ${
              listing.type === "เช่า" ? "bg-blue-600" : "bg-blue-600"
            }`}
          >
            {listing.type}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex space-x-1">
          <button className="bg-white/90 p-1.5 rounded-full hover:bg-white">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
          <button className="bg-white/90 p-1.5 rounded-full hover:bg-white">
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-bold text-lg">{listing.title}</h3>
        <p className="text-gray-600 text-sm">{listing.location}</p>
        <p className="text-blue-600 font-bold text-lg mt-1">{listing.price}</p>

        <div className="flex justify-between mt-3 text-xs text-gray-500">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <span>{listing.views}</span>
            </div>
            <span>ตารางเมตร</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <span>{listing.bedrooms}</span>
            </div>
            <span>ห้องนอน</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <span>{listing.bathrooms}</span>
            </div>
            <span>ห้องน้ำ</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <span>{listing.parking}</span>
            </div>
            <span>จอดรถ</span>
          </div>
        </div>

        {listing.isTopPick && (
          <div className="mt-3">
            <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-md uppercase">Top Pick</span>
          </div>
        )}
      </div>
    </div>
  )
}
