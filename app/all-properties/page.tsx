"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Search, ChevronDown, X, Sliders, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { newProperties, rentalProperties, saleProperties } from "@/data/properties"
import { Slider } from "@/components/ui/slider"

export default function AllPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 34001000]) 
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null)
  const [selectedRentalType, setSelectedRentalType] = useState<string | null>(null)
  const [selectedRooms, setSelectedRooms] = useState<string | null>(null)
  
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  // Combine all properties for display
  const allProperties = [...newProperties, ...rentalProperties, ...saleProperties]

  // Filter properties based on active filter
  const filteredProperties = allProperties.filter((property) => {
    if (!activeFilter) return true

    switch (activeFilter) {
      case "buy":
      case "sell":
        return property.isForSale
      case "rent":
        return property.isForRent
      case "near-bts":
      case "near-red-line":
      case "near-university":
        // In a real app, you would filter based on property metadata
        return true
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <div className="relative h-[300px]">
        <Image src="/hero-background.jpg" alt="Bangkok skyline" fill className="object-cover brightness-75" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-teal-900/60"></div>

        {/* Search Bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาโครงการ,ราคา"
                className="w-full h-14 pl-4 pr-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-0 top-0 h-full w-14 bg-blue-600 rounded-r-md flex items-center justify-center">
                <Search className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Filter Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Property Type Filter */}
          <div className="relative" ref={el => dropdownRefs.current['propertyType'] = el}>
            <FilterButton
              label="ทุกประเภทอสังหาฯ"
              isActive={activeFilter === "propertyType"}
              onClick={() => {
                setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')
                setActiveFilter("propertyType")
              }}
              hasDropdown
            />
            {openDropdown === 'propertyType' && (
              <div className="absolute mt-2 z-20 bg-white shadow-lg rounded-md border border-gray-200 w-64 p-4">
                <div className="space-y-2">
                  <PropertyTypeOption label="ทุกประเภทอสังหาฯ" isSelected={selectedPropertyType === null} onClick={() => setSelectedPropertyType(null)} />
                  <PropertyTypeOption label="บ้านเดี่ยว" isSelected={selectedPropertyType === 'house'} onClick={() => setSelectedPropertyType('house')} />
                  <PropertyTypeOption label="ทาวน์โฮม" isSelected={selectedPropertyType === 'townhome'} onClick={() => setSelectedPropertyType('townhome')} />
                  <PropertyTypeOption label="คอนโดมิเนียม" isSelected={selectedPropertyType === 'condo'} onClick={() => setSelectedPropertyType('condo')} hot />
                  <PropertyTypeOption label="ที่ดิน" isSelected={selectedPropertyType === 'land'} onClick={() => setSelectedPropertyType('land')} />
                  <PropertyTypeOption label="พื้นที่ขายของ" isSelected={selectedPropertyType === 'retail'} onClick={() => setSelectedPropertyType('retail')} />
                  <PropertyTypeOption label="อาคารพาณิชย์" isSelected={selectedPropertyType === 'commercial'} onClick={() => setSelectedPropertyType('commercial')} />
                  <PropertyTypeOption label="สำนักงาน" isSelected={selectedPropertyType === 'office'} onClick={() => setSelectedPropertyType('office')} />
                  <PropertyTypeOption label="กิจการ" isSelected={selectedPropertyType === 'business'} onClick={() => setSelectedPropertyType('business')} />
                </div>
              </div>
            )}
          </div>
          
          {/* Rental Type Filter */}
          <div className="relative" ref={el => dropdownRefs.current['rentalType'] = el}>
            <FilterButton
              label="ประเภทเช่า"
              isActive={activeFilter === "rent"}
              onClick={() => {
                setOpenDropdown(openDropdown === 'rentalType' ? null : 'rentalType')
                setActiveFilter("rent")
              }}
              hasDropdown
            />
            {openDropdown === 'rentalType' && (
              <div className="absolute mt-2 z-20 bg-white shadow-lg rounded-md border border-gray-200 w-64 p-4">
                <div className="space-y-2">
                  <PropertyTypeOption label="ประเภทเช่า" isSelected={selectedRentalType === null} onClick={() => setSelectedRentalType(null)} />
                  <PropertyTypeOption label="ประเภทขาย" isSelected={selectedRentalType === 'sell'} onClick={() => setSelectedRentalType('sell')} hot />
                </div>
              </div>
            )}
          </div>
          
          {/* Room Filter */}
          <div className="relative" ref={el => dropdownRefs.current['rooms'] = el}>
            <FilterButton
              label="ประเภทห้อง"
              isActive={activeFilter === "rooms"}
              onClick={() => {
                setOpenDropdown(openDropdown === 'rooms' ? null : 'rooms')
                setActiveFilter("rooms")
              }}
              hasDropdown
            />
            {openDropdown === 'rooms' && (
              <div className="absolute mt-2 z-20 bg-white shadow-lg rounded-md border border-gray-200 w-64 p-4">
                <div className="space-y-2">
                  <h3 className="font-medium mb-2">ทุกประเภทห้อง</h3>
                  <div className="space-y-2">
                    <RoomOption label="สตูดิโอ" isSelected={selectedRooms === 'studio'} onClick={() => setSelectedRooms('studio')} />
                    <RoomOption label="1 ห้องนอน" isSelected={selectedRooms === '1'} onClick={() => setSelectedRooms('1')} />
                    <RoomOption label="2 ห้องนอน" isSelected={selectedRooms === '2'} onClick={() => setSelectedRooms('2')} />
                    <RoomOption label="3 ห้องนอน" isSelected={selectedRooms === '3'} onClick={() => setSelectedRooms('3')} />
                    <RoomOption label="4 ห้องนอน" isSelected={selectedRooms === '4'} onClick={() => setSelectedRooms('4')} />
                    <RoomOption label="อื่นๆ ..." isSelected={selectedRooms === 'other'} onClick={() => setSelectedRooms('other')} />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Price Filter */}
          <div className="relative" ref={el => dropdownRefs.current['price'] = el}>
            <FilterButton
              label="ราคา"
              isActive={activeFilter === "price"}
              onClick={() => {
                setOpenDropdown(openDropdown === 'price' ? null : 'price')
                setActiveFilter("price")
              }}
              hasDropdown
            />
            {openDropdown === 'price' && (
              <div className="absolute mt-2 z-20 bg-white shadow-lg rounded-md border border-gray-200 w-80 p-5">
                <div className="flex flex-col">
                  <h3 className="font-medium mb-4 text-gray-700">ราคาเช่า</h3>
                  <div className="relative py-6 px-2">
                    <Slider 
                      defaultValue={[priceRange[0], priceRange[1]]} 
                      max={34001000} 
                      step={1000}
                      onValueChange={(value) => setPriceRange(value)}
                      className="mb-6"
                    />
                    <div className="flex justify-between mt-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">ราคาต่ำสุด (บาท/เดือน)</span>
                        <input 
                          type="text" 
                          value={priceRange[0].toLocaleString()} 
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-32 mt-1" 
                          onChange={(e) => {
                            const value = parseInt(e.target.value.replace(/,/g, ''));
                            if (!isNaN(value)) {
                              setPriceRange([value, priceRange[1]]);
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">ราคาสูงสุด (บาท/เดือน)</span>
                        <input 
                          type="text" 
                          value={priceRange[1].toLocaleString()} 
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-32 mt-1" 
                          onChange={(e) => {
                            const value = parseInt(e.target.value.replace(/,/g, ''));
                            if (!isNaN(value)) {
                              setPriceRange([priceRange[0], value]);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-5">
                      <Button variant="outline" className="text-sm px-4 py-2" onClick={() => setPriceRange([0, 34001000])}>
                        Reset
                      </Button>
                      <Button className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* More Filters */}
          <Button variant="outline" className="flex items-center gap-1 border border-gray-300">
            <Sliders size={16} />
            <span>Filters</span>
          </Button>
          
          <div className="flex-grow"></div>
          
          {/* Sort Filter */}
          <div className="relative" ref={el => dropdownRefs.current['sort'] = el}>
            <FilterButton
              label="การจัดเรียง"
              isActive={activeFilter === "sort"}
              onClick={() => {
                setOpenDropdown(openDropdown === 'sort' ? null : 'sort')
                setActiveFilter("sort")
              }}
              hasDropdown
            />
            {openDropdown === 'sort' && (
              <div className="absolute right-0 mt-2 z-20 bg-white shadow-lg rounded-md border border-gray-200 w-64 p-4">
                <div className="space-y-2">
                  <SortOption label="ราคาต่ำ-สูง" />
                  <SortOption label="ราคาสูง-ต่ำ" />
                  <SortOption label="ใหม่ล่าสุด" />
                  <SortOption label="เก่าสุด" />
                </div>
              </div>
            )}
          </div>
          
          <Button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">
            <MapPin size={16} />
            แสดงแผนที่
          </Button>
        </div>

        {/* Page Title and Count */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">อสังหามาใหม่ล่าสุด! พร้อมเข้าอยู่/ลงทุน ราคาดี ทำเลเด่น</h1>
          <p className="text-gray-600">{filteredProperties.length} รายการ</p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface FilterButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
  hasDropdown?: boolean
}

function FilterButton({ label, isActive, onClick, hasDropdown = false }: FilterButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md flex items-center ${
        isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
      {hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
    </button>
  )
}

interface PropertyTypeOptionProps {
  label: string
  isSelected: boolean
  onClick: () => void
  hot?: boolean
}

function PropertyTypeOption({ label, isSelected, onClick, hot = false }: PropertyTypeOptionProps) {
  return (
    <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={onClick}>
      <span className={`${isSelected ? 'text-blue-600 font-medium' : 'text-gray-800'}`}>{label}</span>
      <div className="flex items-center">
        {hot && <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded mr-2">HOT</span>}
        {isSelected && <div className="w-4 h-4 flex items-center justify-center bg-blue-600 rounded-full text-white">✓</div>}
      </div>
    </div>
  )
}

interface RoomOptionProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

function RoomOption({ label, isSelected, onClick }: RoomOptionProps) {
  return (
    <div 
      className={`px-3 py-2 rounded-md cursor-pointer ${
        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </div>
  )
}

function SortOption({ label }: { label: string }) {
  return (
    <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
      {label}
    </div>
  )
}
