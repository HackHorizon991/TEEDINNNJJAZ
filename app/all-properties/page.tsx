"use client"
import { HeroSection } from "@/components/hero-section"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Search, ChevronDown, X, Sliders, MapPin, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { newProperties as staticNewProperties, rentalProperties as staticRentalProperties, saleProperties as staticSaleProperties } from "@/data/properties"
import { Slider } from "@/components/ui/slider"
import { createClient } from "@/utils/supabase/client"
import type { PropertyData } from "@/components/property-card"
import Link from "next/link"
import dynamic from "next/dynamic"

// Define a more specific type for the data expected from Supabase
// Adjusted to reflect that Supabase query might return related entities as arrays
type SupabasePropertyRaw = {
  id: string;
  agent_id: string;
  listing_type: string[];
  property_category: string;
  in_project: boolean;
  rental_duration: string | null;
  location: { address?: string; lat?: number; lng?: number } | null;
  created_at: string;
  property_details: Array<{
    project_name: string;
    address: string;
    usable_area: number;
    bedrooms: number;
    bathrooms: number;
    parking_spaces: number;
    house_condition: string;
    highlight: string;
    area_around: string;
    facilities: string[];
    project_facilities: string[];
    description: string;
    price: number;
    images: string[];
  }>;
  agent_info: {
    company_name: string;
    license_number: string;
    property_types: string[];
    service_areas: {
      province: string;
      district: string;
    }[];
  };
};

// แก้ไข import path ให้ถูกต้อง
const MapPanel = dynamic(() => import("@/components/map-panel"), { ssr: false });

export default function AllPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 34001000])
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null)
  const [selectedRentalType, setSelectedRentalType] = useState<string | null>(null)
  const [selectedRooms, setSelectedRooms] = useState<string | null>(null)
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'supabase' | 'static'>('supabase')
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [showMapView, setShowMapView] = useState(false)
  const [activeProperty, setActiveProperty] = useState<any | null>(null)
  // เพิ่ม state สำหรับ full screen mode
  const [isMapFullScreen, setIsMapFullScreen] = useState(false)

  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const addDebugLog = (log: string) => {
    console.log(log);
    setDebugLogs(prev => [...prev, `${new Date().toISOString()}: ${log}`]);
  }

  // Fix for TypeScript ref callback error
  const setDropdownRef = (key: string) => (el: HTMLDivElement | null) => {
    dropdownRefs.current[key] = el;
    return undefined;
  };

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

  useEffect(() => {
    async function fetchProperties() {
      try {
        addDebugLog("เริ่มต้นการเชื่อมต่อกับ Supabase...");

        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          addDebugLog(`SUPABASE_URL มีค่าหรือไม่: ${!!supabaseUrl}`);
          addDebugLog(`SUPABASE_ANON_KEY มีค่าหรือไม่: ${!!supabaseKey}`);
          if (!supabaseUrl || !supabaseKey) {
            throw new Error("Supabase configuration is missing. NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.");
          }
          createClient(); // Initialize to check
          addDebugLog("สร้าง Supabase client สำเร็จ");
        } catch (configError: any) {
          addDebugLog(`เกิดข้อผิดพลาดในการตรวจสอบ config: ${configError.message}`);
          throw configError;
        }

        // ใช้ API endpoint แทนการเรียกใช้ Supabase client โดยตรง
        addDebugLog("กำลังดึงข้อมูลอสังหาริมทรัพย์ผ่าน API endpoint...");

        const response = await fetch('/api/get-properties');

        if (!response.ok) {
          const errorData = await response.json();
          addDebugLog(`API ส่งค่า error: ${errorData.error || response.statusText}`);
          throw new Error(errorData.error || 'Failed to fetch data from API');
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          addDebugLog(`API ไม่สำเร็จ: ${result.error || 'ไม่มีข้อมูล'}`);
          return await fallbackAndFetchSeparately();
        }

        const data = result.data;
        addDebugLog(`ดึงข้อมูลผ่าน API สำเร็จ จำนวน: ${data?.length || 0} รายการ`);

        if (!data || data.length === 0) {
          addDebugLog("ไม่พบข้อมูลจาก API endpoint กำลังลองดึงข้อมูลจากแต่ละตารางแยกกัน...");
          return await fallbackAndFetchSeparately();
        }

        // This type assertion should now be compatible with the modified SupabasePropertyRaw
        const rawProperties = data as SupabasePropertyRaw[];

        const transformedData = rawProperties.map(item => {
          addDebugLog(`กำลังแปลงข้อมูล property ${item.id}`);

          // Access the first element of the arrays
          // ตรวจสอบว่า property_details มีข้อมูลหรือไม่
          if (!item.property_details || item.property_details.length === 0) {
            addDebugLog(`ไม่พบ property_details สำหรับ property ID ${item.id}`);
            return null;
          }

          const detailsObject = item.property_details[0];
          // ใช้ agent_info แทน agens
          const agentObject = item.agent_info;

          return {
            id: item.id,
            title: detailsObject.project_name || item.property_category || "Untitled Property",
            location: item.location?.address || detailsObject.address || "Unknown Location",
            price: detailsObject.price?.toLocaleString() || "0",
            isPricePerMonth: item.listing_type?.includes("เช่า"),
            details: {
              area: detailsObject.usable_area || 0,
              bedrooms: detailsObject.bedrooms || 0,
              bathrooms: detailsObject.bathrooms || 0,
              parking: detailsObject.parking_spaces || 0,
            },
            image: detailsObject.images?.[0] || "/placeholder.svg",
            isForRent: item.listing_type?.includes("เช่า"),
            isForSale: item.listing_type?.includes("ขาย"),
            isTopPick: false,
            description: detailsObject.description || "",
            highlight: detailsObject.highlight || "",
            facilities: detailsObject.facilities || [],
            projectFacilities: detailsObject.project_facilities || [],
            agentInfo: agentObject ? {
              companyName: agentObject.company_name || "",
              licenseNumber: agentObject.license_number || "",
              propertyTypes: agentObject.property_types || [],
              serviceAreas: Array.isArray(agentObject.service_areas)
                ? agentObject.service_areas?.map((sa: any) => `${sa.district}, ${sa.province}`)
                : []
            } : null
          } as PropertyData;
        }).filter(Boolean) as PropertyData[];

        addDebugLog(`แปลงข้อมูลแล้ว ${transformedData.length} รายการ`);

        if (transformedData.length > 0) {
          setProperties(transformedData);
          setDataSource('supabase');
        } else {
          addDebugLog("ไม่มีข้อมูลหลังจากแปลงข้อมูล จะใช้ข้อมูลแบบ static แทน");
          fallbackToStaticData();
        }

      } catch (error: any) {
        addDebugLog(`เกิดข้อผิดพลาดที่ไม่คาดคิดใน fetchProperties: ${error.message}`);
        if (error.stack) addDebugLog(`Stack trace: ${error.stack}`);
        if (dataSource !== 'static') fallbackToStaticData();
      } finally {
        setIsLoading(false);
      }
    }

    async function fallbackAndFetchSeparately() {
      addDebugLog("เริ่มต้นการดึงข้อมูลแบบ fallback (แยกตาราง)...");

      try {
        // ใช้ API endpoint สำรองเพื่อดึงข้อมูลแบบแยกตาราง
        const response = await fetch('/api/get-properties?mode=fallback');

        if (!response.ok) {
          addDebugLog(`API fallback ไม่สำเร็จ: ${response.statusText}`);
          fallbackToStaticData();
          return;
        }

        const result = await response.json();

        if (!result.success || !result.data || result.data.length === 0) {
          addDebugLog(`API fallback ไม่มีข้อมูล: ${result.error || 'ไม่มีข้อมูล'}`);
          fallbackToStaticData();
          return;
        }

        const transformedData = result.data as PropertyData[];

        if (transformedData.length > 0) {
          setProperties(transformedData);
          setDataSource('supabase');
          addDebugLog("Fallback API: อัปเดต state ด้วยข้อมูลที่ดึงแบบแยกตารางแล้ว");
        } else {
          addDebugLog("Fallback API: ไม่มีข้อมูลหลังแปลงข้อมูล จะใช้ข้อมูล static");
          fallbackToStaticData();
        }
      } catch (error: any) {
        addDebugLog(`Fallback API: เกิดข้อผิดพลาด: ${error.message}`);
        fallbackToStaticData();
      }
    }

    function fallbackToStaticData() {
      addDebugLog("ใช้ข้อมูลแบบ static แทน");
      setProperties([...staticNewProperties, ...staticRentalProperties, ...staticSaleProperties]);
      setDataSource('static');
    }

    fetchProperties();
  }, []);

  // Filter properties based on active filter
  const filteredProperties = properties.filter((property) => {
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
      <HeroSection activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-xl">กำลังโหลดข้อมูลอสังหาริมทรัพย์...</p>
          </div>
        ) : (
          <>
            {dataSource === 'static' && (
              <div className="container mx-auto px-4 py-4 text-center bg-yellow-100 text-yellow-700 rounded-md my-4">
                <div className="flex flex-col items-center">
                  <p className="font-medium">⚠️ ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้อย่างสมบูรณ์</p>
                  <p className="text-sm mt-2">
                    {debugLogs.find(log => log.includes('No internet connection available'))
                      ? 'ไม่พบการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อของท่าน'
                      : 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กำลังแสดงข้อมูลตัวอย่างแทน'}
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() => {
                        setIsLoading(true);
                        window.location.reload();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      ลองโหลดข้อมูลใหม่
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/seed-data');
                          const data = await response.json();
                          if (data.success) {
                            alert("เพิ่มข้อมูลตัวอย่างสำเร็จ กำลังโหลดข้อมูลใหม่...");
                            window.location.reload();
                          } else {
                            alert("เกิดข้อผิดพลาด: " + data.error);
                          }
                        } catch (error) {
                          alert("เกิดข้อผิดพลาด: " + (error instanceof Error ? error.message : "Unknown error"));
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      เพิ่มข้อมูลตัวอย่างลงฐานข้อมูล
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-8 items-center">
              {/* Property Type Filter */}
              <div className="relative" ref={setDropdownRef('propertyType')}>
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
              <div className="relative" ref={setDropdownRef('rentalType')}>
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
              <div className="relative" ref={setDropdownRef('rooms')}>
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
              <div className="relative" ref={setDropdownRef('price')}>
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
              <div className="relative" ref={setDropdownRef('sort')}>
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

              {/* Map View Buttons */}
              <Button
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${showMapView ? 'bg-gray-200 text-blue-600' : 'bg-blue-600 text-white'}`}
                onClick={() => setShowMapView(v => !v)}
              >
                <MapPin size={16} />
                {showMapView ? 'ซ่อนแผนที่' : 'แสดงแผนที่'}
              </Button>

              {/* Full Screen Map Button - แสดงเมื่อ showMapView = true */}
              {showMapView && (
                <Button
                  className="px-4 py-2 rounded-md flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                  onClick={() => setIsMapFullScreen(true)}
                >
                  <Maximize2 size={16} />
                  แผนที่เต็มจอ
                </Button>
              )}
            </div>

            {/* Page Title and Count */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">อสังหามาใหม่ล่าสุด! พร้อมเข้าอยู่/ลงทุน ราคาดี ทำเลเด่น</h1>
              <p className="text-gray-600">{filteredProperties.length} รายการ</p>
            </div>

            {/* Main Content: Toggle grid/list+map */}
            {showMapView ? (
              <div className="flex flex-col md:flex-row gap-4">
                {/* List Panel */}
                <div className="w-full md:w-1/2 h-[80vh] overflow-y-auto bg-gray-50 p-2 rounded-lg">
                  {filteredProperties.map(property => (
                    <PropertyListCard
                      key={property.id}
                      property={property}
                      onShowMap={() => setActiveProperty(property)}
                    />
                  ))}
                </div>
                {/* Map Side Panel */}
                <div className="w-full md:w-1/2 h-[80vh] rounded-lg overflow-hidden border relative">
                  <MapPanel
                    properties={filteredProperties.map((p) => ({
                      ...p,
                      image: Array.isArray(p.image) ? p.image[0] : p.image, // ✅ เอาแค่รูปแรก
                    }))}
                    activeProperty={activeProperty}
                    setActiveProperty={setActiveProperty}
                    isFullScreen={isMapFullScreen}
                    onToggleFullScreen={() => setIsMapFullScreen(!isMapFullScreen)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <footer className="bg-[#006CE3] text-white p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div><h3 className="text-lg font-bold mb-4">Teedin</h3><p className="text-sm text-gray-300">แพลตฟอร์มอสังหาริมทรัพย์ที่ช่วยให้คุณค้นหาบ้าน คอนโด และที่ดินได้ง่ายขึ้น</p></div>
            <div><h4 className="font-medium mb-3">เกี่ยวกับเรา</h4><ul className="space-y-2 text-sm text-gray-300"><li><a href="#" className="hover:text-white">เกี่ยวกับ Teedin</a></li><li><a href="#" className="hover:text-white">ติดต่อเรา</a></li><li><a href="#" className="hover:text-white">ร่วมงานกับเรา</a></li></ul></div>
            <div><h4 className="font-medium mb-3">บริการของเรา</h4><ul className="space-y-2 text-sm text-gray-300"><li><a href="#" className="hover:text-white">ซื้อบ้าน</a></li><li><a href="#" className="hover:text-white">เช่าบ้าน</a></li><li><a href="#" className="hover:text-white">ขายบ้าน</a></li><li><a href="#" className="hover:text-white">ประเมินราคา</a></li></ul></div>
            <div><h4 className="font-medium mb-3">ติดตามเรา</h4><div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300"><span className="sr-only">Facebook</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-white hover:text-gray-300"><span className="sr-only">Instagram</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416 1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353-.3.882-.344 1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-white hover:text-gray-300"><span className="sr-only">Twitter</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            </div></div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400"><p>© 2023 Teedin. สงวนลิขสิทธิ์</p></div>
        </div>
      </footer>
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
      className={`px-4 py-2 rounded-md flex items-center ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
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
      className={`px-3 py-2 rounded-md cursor-pointer ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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

function PropertyListCard({ property, onShowMap }: { property: any, onShowMap?: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow mb-4 flex flex-col md:flex-row overflow-hidden border">
      <div className="md:w-48 w-full h-40 md:h-auto flex-shrink-0 relative">
        <img src={property.image || property.property_details?.[0]?.images?.[0] || "/placeholder.svg"} alt={property.title || property.property_details?.[0]?.project_name} className="object-cover w-full h-full" />
        {/* ป้าย/Badge ตัวอย่าง */}
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">ประกาศล่าสุด</div>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-lg truncate">{property.title || property.property_details?.[0]?.project_name || property.property_category}</h2>
            {onShowMap && (
              <button className="ml-2 text-gray-400 hover:text-blue-600" title="แสดงแผนที่" onClick={onShowMap}>
                <MapPin size={30} />
              </button>
            )}
          </div>
          <div className="text-blue-600 font-bold text-xl mb-1">฿{property.price || property.property_details?.[0]?.price?.toLocaleString() || "-"} <span className="text-base font-normal text-gray-500">/เดือน</span></div>
          <div className="text-gray-500 text-sm mb-2">{property.location || property.location?.address || "-"}</div>
          <div className="text-gray-700 text-sm line-clamp-2 mb-2">{property.description || property.property_details?.[0]?.description?.slice(0, 80) || "-"}</div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs">{property.details?.bedrooms || property.property_details?.[0]?.bedrooms || 0} ห้องนอน</span>
            <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs">{property.details?.bathrooms || property.property_details?.[0]?.bathrooms || 0} ห้องน้ำ</span>
            <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs">{property.details?.area || property.property_details?.[0]?.usable_area || 0} ตร.ม.</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Link href={`/property/${property.id}`} className="text-blue-600 hover:underline text-sm font-medium">ดูรายละเอียด</Link>
        </div>
      </div>

    </div>
  )
}

