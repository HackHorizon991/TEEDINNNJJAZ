"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Heart, Share2, Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Mock data for favorite listings
const favoriteListings = [
  {
    id: "fav-1",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/modern-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-2",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "5,000,000 บาท",
    type: "ขาย",
    image: "/wooden-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-3",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/apartment-building-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-4",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "5,000,000 บาท",
    type: "ขาย",
    image: "/modern-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-5",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/wooden-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-6",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/apartment-building-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-7",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "5,000,000 บาท",
    type: "ขาย",
    image: "/modern-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-8",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/wooden-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-9",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "5,000,000 บาท",
    type: "ขาย",
    image: "/apartment-building-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
  {
    id: "fav-10",
    title: "SKYLINE CONDO",
    location: "สุขุมวิท - กรุงเทพฯ",
    price: "30,000 บาท / เดือน",
    type: "เช่า",
    image: "/modern-house-property.png",
    views: 850,
    bedrooms: 2,
    bathrooms: 4,
    parking: 2,
    isTopPick: true,
    condition: "ดีมาก",
    floor: 1,
    project: "Skyline Condo",
    yearBuilt: 2564,
    nearBTS: "1.5 Km.",
    nearUniversity: "2.5 Km.",
    nearAirport: "20 Km.",
    nearMall: "3.5 Km.",
    nearHospital: "4.5 Km.",
    petAllowed: "ไม่ได้",
  },
]

export default function FavoritesPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const router = useRouter()

  const handlePropertySelect = (id: string) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter((propId) => propId !== id))
    } else {
      if (selectedProperties.length < 4) {
        setSelectedProperties([...selectedProperties, id])
      } else {
        alert("คุณสามารถเลือกได้สูงสุด 4 รายการเท่านั้น")
      }
    }
  }

  const handleCompare = () => {
    if (selectedProperties.length < 2) {
      alert("กรุณาเลือกอย่างน้อย 2 รายการเพื่อเปรียบเทียบ")
      return
    }

    // Create a query string with the selected property IDs
    const queryString = selectedProperties.map((id) => `id=${id}`).join("&")
    router.push(`/dashboard/compare?${queryString}`)
  }

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold mb-6">รายการที่สนใจ</h1>

      {/* Search and Compare Button */}
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
        <Button
          className={`h-12 ${selectedProperties.length >= 2 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"}`}
          onClick={handleCompare}
          disabled={selectedProperties.length < 2}
        >
          เปรียบเทียบราคา {selectedProperties.length > 0 && `(${selectedProperties.length})`}
        </Button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            activeFilter === "all" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          อสังหาทั้งหมด
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeFilter === "rent" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
          onClick={() => setActiveFilter("rent")}
        >
          เช่า
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeFilter === "sale" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
          onClick={() => setActiveFilter("sale")}
        >
          ขาย
        </button>
      </div>

      {/* Property Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {favoriteListings
          .filter((listing) => {
            if (activeFilter === "all") return true
            if (activeFilter === "rent") return listing.type === "เช่า"
            if (activeFilter === "sale") return listing.type === "ขาย"
            return true
          })
          .map((listing, index) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              isSelected={selectedProperties.includes(listing.id)}
              selectionNumber={selectedProperties.indexOf(listing.id) + 1}
              onSelect={() => handlePropertySelect(listing.id)}
            />
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
    isTopPick: boolean
  }
  isSelected: boolean
  selectionNumber: number
  onSelect: () => void
}

function PropertyCard({ listing, isSelected, selectionNumber, onSelect }: PropertyCardProps) {
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
        isSelected ? "bg-blue-50 border-blue-300" : ""
      }`}
    >
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image src={listing.image || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />

          {/* Selection number overlay */}
          {isSelected && (
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
              {selectionNumber}
            </div>
          )}
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
          <button
            className={`p-1.5 rounded-full ${isSelected ? "bg-blue-600 text-white" : "bg-white/90 hover:bg-white"}`}
            onClick={onSelect}
          >
            {isSelected ? (
              <Check className="h-4 w-4" />
            ) : (
              <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
            )}
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
