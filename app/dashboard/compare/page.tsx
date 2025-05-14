"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for favorite listings - same as in favorites page
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
  // ... other listings
]

export default function ComparePage() {
  const searchParams = useSearchParams()

  // Get the property IDs from the URL
  const propertyIds = searchParams ? Array.from(searchParams.getAll("id")) : []

  // Find the properties in our data - do this directly without state
  const selectedProperties = propertyIds
    .map((id) => favoriteListings.find((listing) => listing.id === id))
    .filter(Boolean) as typeof favoriteListings

  // Check if we have enough properties to compare
  if (selectedProperties.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-xl font-semibold mb-4">กรุณาเลือกอย่างน้อย 2 รายการเพื่อเปรียบเทียบ</h2>
        <Link href="/dashboard/favorites">
          <Button className="bg-blue-600 hover:bg-blue-700">กลับไปยังรายการที่สนใจ</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/favorites">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2" size={16} />
            กลับ
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">เปรียบเทียบราคา</h1>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {selectedProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative">
              <div className="relative h-48 w-full">
                <Image src={property.image || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
              </div>
              <div className="absolute top-3 left-3">
                <span className={`px-4 py-1 text-sm font-medium rounded-full text-white bg-blue-600`}>
                  {property.type}
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-lg">{property.title}</h3>
              <p className="text-gray-600 text-sm">{property.location}</p>
              <p className="text-blue-600 font-bold text-lg mt-1">{property.price}</p>

              <div className="flex justify-between mt-3 text-xs text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span>{property.views}</span>
                  </div>
                  <span>ตารางเมตร</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span>{property.bedrooms}</span>
                  </div>
                  <span>ห้องนอน</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span>{property.bathrooms}</span>
                  </div>
                  <span>ห้องน้ำ</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span>{property.parking}</span>
                  </div>
                  <span>จอดรถ</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {/* Price */}
            <tr>
              <td className="py-4 px-4 font-medium">ราคา</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-price`} className="py-4 px-4 text-center">
                  {property.price}
                </td>
              ))}
            </tr>

            {/* Area Size */}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-medium">ขนาดพื้นที่</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-area`} className="py-4 px-4 text-center">
                  {property.views} ตร.ม.
                </td>
              ))}
            </tr>

            {/* Usable Area */}
            <tr>
              <td className="py-4 px-4 font-medium">พื้นที่ใช้สอย</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-usable`} className="py-4 px-4 text-center">
                  {property.views} ตร.ม.
                </td>
              ))}
            </tr>

            {/* Bedrooms */}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-medium">ห้องนอน</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-bedrooms`} className="py-4 px-4 text-center">
                  {property.bedrooms}
                </td>
              ))}
            </tr>

            {/* Bathrooms */}
            <tr>
              <td className="py-4 px-4 font-medium">ห้องน้ำ</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-bathrooms`} className="py-4 px-4 text-center">
                  {property.bathrooms}
                </td>
              ))}
            </tr>

            {/* Parking */}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-medium">จอดรถ</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-parking`} className="py-4 px-4 text-center">
                  {property.parking}
                </td>
              ))}
            </tr>

            {/* Condition */}
            <tr>
              <td className="py-4 px-4 font-medium">สภาพบ้าน</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-condition`} className="py-4 px-4 text-center">
                  {property.condition}
                </td>
              ))}
            </tr>

            {/* Floor */}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-medium">ชั้น</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-floor`} className="py-4 px-4 text-center">
                  {property.floor}
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr>
              <td className="py-4 px-4 font-medium">ทำเล</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-location`} className="py-4 px-4 text-center">
                  {property.location}
                </td>
              ))}
            </tr>

            {/* Project */}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-medium">โครงการ</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-project`} className="py-4 px-4 text-center">
                  {property.project}
                </td>
              ))}
            </tr>

            {/* Year Built */}
            <tr>
              <td className="py-4 px-4 font-medium">ปีที่สร้าง</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-year`} className="py-4 px-4 text-center">
                  {property.yearBuilt}
                </td>
              ))}
            </tr>

            {/* Near BTS/MRT */}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-medium">ใกล้ BTS/MRT</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-bts`} className="py-4 px-4 text-center">
                  {property.nearBTS}
                </td>
              ))}
            </tr>

            {/* Near University */}
            <tr>
              <td className="py-4 px-4 font-medium">ใกล้มหาวิทยาลัย</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-university`} className="py-4 px-4 text-center">
                  {property.nearUniversity}
                </td>
              ))}
            </tr>

            {/* Near Airport */}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-medium">ใกล้สนามบิน</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-airport`} className="py-4 px-4 text-center">
                  {property.nearAirport}
                </td>
              ))}
            </tr>

            {/* Near Mall */}
            <tr>
              <td className="py-4 px-4 font-medium">ใกล้ห้างสรรพสินค้า</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-mall`} className="py-4 px-4 text-center">
                  {property.nearMall}
                </td>
              ))}
            </tr>

            {/* Near Hospital */}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-medium">ใกล้โรงพยาบาล</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-hospital`} className="py-4 px-4 text-center">
                  {property.nearHospital}
                </td>
              ))}
            </tr>

            {/* Pet Allowed */}
            <tr>
              <td className="py-4 px-4 font-medium">เลี้ยงสัตว์ได้</td>
              {selectedProperties.map((property) => (
                <td key={`${property.id}-pet`} className="py-4 px-4 text-center">
                  {property.petAllowed}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
