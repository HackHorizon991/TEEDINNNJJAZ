import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Share2 } from "lucide-react"
import type { ReactNode } from "react"

// Define TypeScript interfaces for property data
export interface PropertyDetails {
  area: number
  bedrooms: number
  bathrooms: number
  parking: number
}

export interface PropertyData {
  id: string
  title: string
  location: string
  price: string
  isPricePerMonth?: boolean
  details: PropertyDetails
  image: string
  isForRent?: boolean
  isForSale?: boolean
  isTopPick?: boolean
  description?: string
  highlight?: string
  facilities?: string[]
  projectFacilities?: string[]
}

interface PropertyCardProps {
  property: PropertyData
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { id, title, location, price, isPricePerMonth, details, image, isForRent, isForSale, isTopPick } = property

  // Determine the button text based on property type
  const buttonText = isForRent ? "ให้เช่า" : isForSale ? "ขาย" : "ให้เช่า"

  // ตรวจสอบว่า URL รูปภาพเป็น URL ที่ถูกต้องหรือไม่
  const isValidImageUrl = image && (
    image.startsWith("https://") ||
    image.startsWith("http://") ||
    image.startsWith("/")
  );

  // ใช้รูป placeholder ถ้า URL ไม่ถูกต้อง
  const displayImage = isValidImageUrl ? image : "/placeholder.svg";

  return (
    <Link href={`/property/${id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="relative">
          <div className="w-full h-48 relative">
            <Image
              src={displayImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
              onError={(e) => {
                console.error("Image failed to load:", e.currentTarget.src);
                // Can't directly set src with next/image, error handling is different
              }}
            />
          </div>
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className={`text-white px-4 py-1.5 text-sm font-medium rounded-full ${isForRent ? "bg-gradient-to-r from-blue-600 to-blue-500" :
              isForSale ? "bg-gradient-to-r from-blue-600 to-blue-500" :
                "bg-gradient-to-r from-blue-700 to-blue-600"
              }`}>
              {buttonText}
            </span>
            {isTopPick && (
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-1.5 text-sm font-medium rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                แนะนำ
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="bg-white/90 p-1.5 rounded-full hover:bg-white">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="bg-white/90 p-1.5 rounded-full hover:bg-white">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-2">{location}</p>
          <p className="text-[#006ce3] font-bold text-xl mb-4">
            {price} {isPricePerMonth ? "บาท / เดือน" : "บาท"}
          </p>

          <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
            <PropertyDetail icon={<SquareIcon className="h-4 w-4 mr-1" />} value={details.area} label="ตารางเมตร" />
            <PropertyDetail icon={<BedIcon className="h-4 w-4 mr-1" />} value={details.bedrooms} label="ห้องนอน" />
            <PropertyDetail icon={<BathIcon className="h-4 w-4 mr-1" />} value={details.bathrooms} label="ห้องน้ำ" />
            <PropertyDetail icon={<CarIcon className="h-4 w-4 mr-1" />} value={details.parking} label="จอดรถ" />
          </div>

          {isTopPick && (
            <div className="mt-4">
              <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full uppercase">Top Pick</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

interface PropertyDetailProps {
  icon: ReactNode
  value: number
  label: string
}

function PropertyDetail({ icon, value, label }: PropertyDetailProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-1">
        {icon}
        <span>{value}</span>
      </div>
      <span>{label}</span>
    </div>
  )
}

function SquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  )
}

function BedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 4v16" />
      <path d="M22 4v16" />
      <path d="M2 8h20" />
      <path d="M2 16h20" />
      <path d="M12 4v4" />
      <path d="M12 16v4" />
    </svg>
  )
}

function BathIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
      <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
      <path d="m4 21 1-1.5" />
      <path d="M20 21 19 19.5" />
    </svg>
  )
}

function CarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}
