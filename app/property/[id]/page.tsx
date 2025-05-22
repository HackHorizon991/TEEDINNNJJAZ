"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, ChevronRight, Home, Ruler, Trees, AirVent, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import Script from "next/script"

type PropertyDetailType = {
  property_id: string
  project_name: string
  address: string
  usable_area: number
  bedrooms: number
  bathrooms: number
  parking_spaces: number
  house_condition: string
  highlight: string
  area_around: string
  facilities: string[]
  project_facilities: string[]
  description: string
  price: string
  images: string[]
  latitude?: number
  longitude?: number
}

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const [activeImage, setActiveImage] = useState(0)
  const [property, setProperty] = useState<PropertyDetailType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'supabase' | 'static'>('supabase')
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  const addDebugLog = (log: string) => {
    console.log(log);
    setDebugLogs(prev => [...prev, `${new Date().toISOString()}: ${log}`]);
  }

  useEffect(() => {
    async function fetchProperty() {
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

        addDebugLog(`กำลังดึงข้อมูลอสังหาริมทรัพย์ ID: ${params.id}...`);

        const response = await fetch(`/api/properties/${params.id}`);

        if (!response.ok) {
          const errorData = await response.json();
          addDebugLog(`API ส่งค่า error: ${errorData.error || response.statusText}`);
          throw new Error(errorData.error || 'Failed to fetch data from API');
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          addDebugLog(`API ไม่สำเร็จ: ${result.error || 'ไม่มีข้อมูล'}`);
          throw new Error(result.error || 'No data available');
        }

        const data = result.data;
        addDebugLog("ดึงข้อมูลสำเร็จ");

        if (!data) {
          addDebugLog("ไม่พบข้อมูลจาก API endpoint");
          throw new Error('No data available');
        }

        setProperty(data);
        setDataSource('supabase');

      } catch (error: any) {
        addDebugLog(`เกิดข้อผิดพลาด: ${error.message}`);
        if (error.stack) addDebugLog(`Stack trace: ${error.stack}`);

        // Fallback to static data
        addDebugLog("กำลังใช้ข้อมูลแบบ static...");
        try {
          const staticResponse = await fetch('/api/static-properties');
          const staticData = await staticResponse.json();
          if (staticData && staticData[params.id]) {
            setProperty(staticData[params.id]);
            setDataSource('static');
            addDebugLog("ใช้ข้อมูล static สำเร็จ");
          } else {
            throw new Error('No static data available');
          }
        } catch (staticError: any) {
          addDebugLog(`ไม่สามารถใช้ข้อมูล static ได้: ${staticError.message}`);
          // You might want to show an error message to the user here
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลอสังหาริมทรัพย์...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">ไม่พบข้อมูลอสังหาริมทรัพย์</p>
          <Link href="/" className="text-blue-600 hover:underline">
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {dataSource === 'static' && (
        <div className="container mx-auto px-4 py-4 text-center bg-yellow-100 text-yellow-700 rounded-md my-4">
          <div className="flex flex-col items-center">
            <p className="font-medium">⚠️ ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้อย่างสมบูรณ์</p>
            <p className="text-sm mt-2">
              {debugLogs.find(log => log.includes('No internet connection available'))
                ? 'ไม่พบการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อของท่าน'
                : 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กำลังแสดงข้อมูลตัวอย่างแทน'}
            </p>
            <div className="mt-3">
              <button
                onClick={() => {
                  setIsLoading(true);
                  window.location.reload();
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                ลองโหลดข้อมูลใหม่
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link href="/" className="flex items-center text-gray-800 text-lg font-medium hover:underline w-fit">
          <ArrowLeft className="mr-2" size={24} />
          <span>ย้อนกลับ</span>
        </Link>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={property.images[activeImage] || "/placeholder.svg"}
                alt={property.project_name}
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
                <Image src={image || "/placeholder.svg"} alt={`Image ${index + 2}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ชื่อโครงการและที่อยู่ */}
        <h1 className="text-3xl font-bold mb-2">{property.project_name}</h1>
        <div className="text-gray-500 mb-4">{property.address}</div>
        {/* ราคา */}
        <div className="text-2xl font-semibold mb-6">
          ราคา : <span className="font-bold text-3xl">{Number(property.price).toLocaleString()} บาท</span>
        </div>

        {/* ตารางพื้นที่ใช้สอย */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-2">พื้นที่ใช้สอย</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg text-center">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 font-medium">พื้นที่</th>
                  <th className="px-4 py-2 font-medium">ห้องนอน</th>
                  <th className="px-4 py-2 font-medium">ห้องน้ำ</th>
                  <th className="px-4 py-2 font-medium">จอดรถ</th>
                  <th className="px-4 py-2 font-medium">สภาพบ้าน</th>
                  <th className="px-4 py-2 font-medium">ประเภท</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">{property.usable_area} ตร.ม.</td>
                  <td className="px-4 py-2">{property.bedrooms}</td>
                  <td className="px-4 py-2">{property.bathrooms}</td>
                  <td className="px-4 py-2">{property.parking_spaces}</td>
                  <td className="px-4 py-2">{property.house_condition}</td>
                  <td className="px-4 py-2">เช่า</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* จุดเด่นอสังหาฯ */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">จุดเด่นอสังหาฯ</h2>
          <ul className="space-y-2 mb-4">
            {property.highlight.split("\n").map((highlight, idx) => (
              <li key={idx} className="flex items-center text-gray-700">
                {/* เลือกไอคอนตามเนื้อหาเบื้องต้น */}
                {highlight.includes('บ้านเดี่ยว') ? <Home className="text-blue-500 mr-2" size={18} /> :
                  highlight.includes('พื้นที่ใช้สอย') ? <Ruler className="text-blue-500 mr-2" size={18} /> :
                    highlight.includes('ส่วนตัว') ? <Trees className="text-green-500 mr-2" size={18} /> :
                      highlight.includes('แอร์') ? <AirVent className="text-cyan-500 mr-2" size={18} /> :
                        highlight.includes('ส่วนกลาง') ? <Building2 className="text-yellow-500 mr-2" size={18} /> :
                          <span className="text-blue-500 mr-2">•</span>}
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
          <button className="flex items-center px-6 py-2 border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition">
            ดูทั้งหมด <ChevronRight className="ml-2" size={18} />
          </button>
        </div>

        {/* เกี่ยวกับอสังหาฯ */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">เกี่ยวกับอสังหาฯ</h2>
          <p className="text-gray-600 mb-4">{property.description}</p>
          <button className="flex items-center px-6 py-2 border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition">
            ดูทั้งหมด <ChevronRight className="ml-2" size={18} />
          </button>
        </div>

        {/* ที่ตั้งอสังหาฯ (OpenStreetMap) */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">ที่ตั้งอสังหาฯ</h2>
          {property.latitude && property.longitude ? (
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-white mb-2">
              <iframe
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01},${property.latitude - 0.01},${property.longitude + 0.01},${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude},${property.longitude}`}
              />
            </div>
          ) : (
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-2">
              <p className="text-gray-500">ไม่พบพิกัดที่ตั้ง</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{property.address}</p>
            {property.latitude && property.longitude && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${property.latitude}&mlon=${property.longitude}#map=15/${property.latitude}/${property.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                เปิดใน OpenStreetMap
                <ChevronRight size={16} className="ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Contact Agent (mock) */}
      <div className="fixed bottom-0 right-0 md:top-40 md:bottom-auto md:right-4 w-full md:w-72 bg-blue-600 text-white rounded-t-lg md:rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-center text-lg font-medium mb-4">สอบถามเกี่ยวกับทรัพย์สิน</h3>
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-300 mb-2 overflow-hidden relative">
              <Image src="/agent-avatar.png" alt="Agent" fill className="object-cover" />
            </div>
            <p className="text-sm">ชื่อเอเจ้นท์</p>
            <p className="text-sm text-gray-100">ตัวแทนทรัพย์สิน</p>
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
