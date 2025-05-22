"use client"

import { HeroSection } from "@/components/hero-section"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, ChevronRight, Home, Ruler, Trees, AirVent, Building2, MapPin, Bed, Bath, Car, Star, Phone, MessageCircle } from "lucide-react"
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
  const [isFavorite, setIsFavorite] = useState(false)

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
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 fle    x items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">กำลังโหลดข้อมูลอสังหาริมทรัพย์...</p>
          <p className="text-gray-400 text-sm mt-2">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบข้อมูลอสังหาริมทรัพย์</h2>
          <p className="text-gray-600 mb-6">ขออภัย เราไม่พบทรัพย์สินที่คุณกำลังค้นหา</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Banner */}
      {dataSource === 'static' && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-3 md:mb-0">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">⚠️</span>
                </div>
                <div>
                  <p className="font-semibold">ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้อย่างสมบูรณ์</p>
                  <p className="text-sm opacity-90">
                    {debugLogs.find(log => log.includes('No internet connection available'))
                      ? 'ไม่พบการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อของท่าน'
                      : 'กำลังแสดงข้อมูลตัวอย่างแทน'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsLoading(true);
                  window.location.reload();
                }}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-colors font-medium"
              >
                ลองโหลดใหม่
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group">
              <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mr-3 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">ย้อนกลับ</span>
            </Link>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-3">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src={property.images[activeImage] || "/placeholder.svg"}
                  alt={property.project_name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {activeImage + 1} / {property.images.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
              {property.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative h-50 lg:h-70 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${activeImage === index
                    ? 'ring-3 ring-blue-500 shadow-lg'
                    : 'hover:ring-2 hover:ring-blue-300 hover:shadow-md'
                    }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image src={image || "/placeholder.svg"} alt={`รูปที่ ${index + 1}`} fill className="object-cover" />
                  {activeImage === index && (
                    <div className="absolute inset-0 bg-blue-500/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{property.project_name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    <span className="text-lg">{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-2">
                    สำหรับเช่า
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">ราคา</span>
                    <div className="text-3xl font-bold text-blue-600">
                      ฿{Number(property.price).toLocaleString()}
                    </div>
                    <span className="text-gray-500 text-sm">/ เดือน</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Ruler className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="font-bold text-lg">{property.usable_area}</div>
                  <div className="text-sm text-gray-600">ตร.ม.</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Bed className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="font-bold text-lg">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">ห้องนอน</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Bath className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <div className="font-bold text-lg">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">ห้องน้ำ</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Car className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <div className="font-bold text-lg">{property.parking_spaces}</div>
                  <div className="text-sm text-gray-600">จอดรถ</div>
                </div>
              </div>
            </div>

            {/* Property Details Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">รายละเอียดทรัพย์สิน</h2>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">พื้นที่</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">ห้องนอน</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">ห้องน้ำ</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">จอดรถ</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">สภาพ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{property.usable_area} ตร.ม.</td>
                      <td className="px-6 py-4">{property.bedrooms}</td>
                      <td className="px-6 py-4">{property.bathrooms}</td>
                      <td className="px-6 py-4">{property.parking_spaces}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {property.house_condition}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">จุดเด่นอสังหาฯ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {property.highlight.split("\n").map((highlight, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    {highlight.includes('บ้านเดี่ยว') ? <Home className="text-blue-500 mr-3 flex-shrink-0" size={20} /> :
                      highlight.includes('พื้นที่ใช้สอย') ? <Ruler className="text-blue-500 mr-3 flex-shrink-0" size={20} /> :
                        highlight.includes('ส่วนตัว') ? <Trees className="text-green-500 mr-3 flex-shrink-0" size={20} /> :
                          highlight.includes('แอร์') ? <AirVent className="text-cyan-500 mr-3 flex-shrink-0" size={20} /> :
                            highlight.includes('ส่วนกลาง') ? <Building2 className="text-yellow-500 mr-3 flex-shrink-0" size={20} /> :
                              <Star className="text-blue-500 mr-3 flex-shrink-0" size={20} />}
                    <span className="text-gray-700 font-medium">{highlight.trim()}</span>
                  </div>
                ))}
              </div>
              <button className="flex items-center px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium">
                ดูรายละเอียดเพิ่มเติม <ChevronRight className="ml-2" size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">เกี่ยวกับอสังหาฯ</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">{property.description}</p>
              </div>
              <button className="flex items-center px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium">
                อ่านเพิ่มเติม <ChevronRight className="ml-2" size={18} />
              </button>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ที่ตั้งอสังหาฯ</h2>
              {property.latitude && property.longitude ? (
                <div className="space-y-4">
                  <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      className="w-full h-full"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01},${property.latitude - 0.01},${property.longitude + 0.01},${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude},${property.longitude}`}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">{property.address}</span>
                    </div>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${property.latitude}&mlon=${property.longitude}#map=15/${property.latitude}/${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      เปิดแผนที่
                      <ChevronRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative h-80 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">ไม่พบข้อมูลตำแหน่ง</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Contact Agent */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-center mb-6">สอบถามเกี่ยวกับทรัพย์สิน</h3>

                <div className="text-center mb-6">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 overflow-hidden shadow-lg">
                      <Image src="/agent-avatar.png" alt="Agent" fill className="object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <h4 className="font-bold text-lg">นายสมชาย ใจดี</h4>
                  <p className="text-blue-100 text-sm">ตัวแทนทรัพย์สิน</p>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-blue-100 text-sm ml-2">(4.9)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 rounded-xl shadow-md">
                    <Phone className="w-4 h-4 mr-2" />
                    โทรสอบถาม
                  </Button>
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm font-medium py-3 rounded-xl">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    ส่งข้อความ
                  </Button>
                  <Button className="w-full bg-green-500 hover:bg-green-600 font-medium py-3 rounded-xl shadow-md">
                    นัดชมทรัพย์สิน
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <p className="text-sm text-blue-100 text-center">
                    📞 ติดต่อเราได้ตลอด 24 ชั่วโมง
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* รายการอสังหาริมทรัพย์ใกล้เคียง/แนะนำ */}
      <div className="bg-gray-100 py-10 mt-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">อสังหาริมทรัพย์ใกล้เคียงที่แนะนำ</h2>

          <div className="flex overflow-x-auto pb-6 -mx-2 scrollbar-hide">
            {/* รายการอสังหาฯ 1 */}
            <div className="min-w-[280px] max-w-[280px] px-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    ให้เช่า
                  </div>
                  <img src="/assets/property-1.jpg" alt="SKYLINE CONDO" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">SKYLINE CONDO</h3>
                  <p className="text-sm text-gray-600 mb-1">สุขุมวิท · กรุงเทพฯ</p>
                  <p className="text-blue-600 font-bold mb-2">30,000 บาท / เดือน</p>
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>2 ห้องนอน</span>
                    <span>2 ห้องน้ำ</span>
                    <span>35 ตร.ม.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* รายการอสังหาฯ 2 */}
            <div className="min-w-[280px] max-w-[280px] px-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    ขาย
                  </div>
                  <img src="/assets/property-2.jpg" alt="SKYLINE CONDO" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">SKYLINE CONDO</h3>
                  <p className="text-sm text-gray-600 mb-1">สุขุมวิท · กรุงเทพฯ</p>
                  <p className="text-blue-600 font-bold mb-2">5,000,000 บาท</p>
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>2 ห้องนอน</span>
                    <span>2 ห้องน้ำ</span>
                    <span>50 ตร.ม.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* รายการอสังหาฯ 3 */}
            <div className="min-w-[280px] max-w-[280px] px-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    ให้เช่า
                  </div>
                  <img src="/assets/property-3.jpg" alt="SKYLINE CONDO" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">SKYLINE CONDO</h3>
                  <p className="text-sm text-gray-600 mb-1">สุขุมวิท · กรุงเทพฯ</p>
                  <p className="text-blue-600 font-bold mb-2">30,000 บาท / เดือน</p>
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>2 ห้องนอน</span>
                    <span>2 ห้องน้ำ</span>
                    <span>60 ตร.ม.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* รายการอสังหาฯ 4 */}
            <div className="min-w-[280px] max-w-[280px] px-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    ขาย
                  </div>
                  <img src="/assets/property-4.jpg" alt="SKYLINE CONDO" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">SKYLINE CONDO</h3>
                  <p className="text-sm text-gray-600 mb-1">สุขุมวิท · กรุงเทพฯ</p>
                  <p className="text-blue-600 font-bold mb-2">5,000,000 บาท</p>
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>2 ห้องนอน</span>
                    <span>2 ห้องน้ำ</span>
                    <span>45 ตร.ม.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* รายการอสังหาฯ 5 */}
            <div className="min-w-[280px] max-w-[280px] px-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    ให้เช่า
                  </div>
                  <img src="/assets/property-5.jpg" alt="SKYLINE CONDO" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">SKYLINE CONDO</h3>
                  <p className="text-sm text-gray-600 mb-1">สุขุมวิท · กรุงเทพฯ</p>
                  <p className="text-blue-600 font-bold mb-2">30,000 บาท / เดือน</p>
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>2 ห้องนอน</span>
                    <span>2 ห้องน้ำ</span>
                    <span>40 ตร.ม.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">
              ดูอสังหาริมทรัพย์ทั้งหมด
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-col          s-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Teedin</h3>
              <p className="text-blue-100 leading-relaxed">
                แพลตฟอร์มอสังหาริมทรัพย์ที่ช่วยให้คุณค้นหาบ้าน คอนโด และที่ดินได้ง่ายขึ้น
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">เกี่ยวกับเรา</h4>
              <ul className="space-y-3 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">เกี่ยวกับ Teedin</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ติดต่อเรา</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ร่วมงานกับเรา</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">บริการของเรา</h4>
              <ul className="space-y-3 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">ซื้อบ้าน</a></li>
                <li><a href="#" className="hover:text-white transition-colors">เช่าบ้าน</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ขายบ้าน</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ประเมินราคา</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ติดตามเรา</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-blue-100 text-sm">© 2023 Teedin. สงวนลิขสิทธิ์</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">นโยบายความเป็นส่วนตัว</a>
                <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">เงื่อนไขการใช้งาน</a>
                <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">คุกกี้</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}