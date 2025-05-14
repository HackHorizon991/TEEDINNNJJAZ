import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FeaturedPropertyProps {
  title: string
  location: string
  description: string
  price: string
  images: string[]
  details: {
    totalUnits: string
    roomSize: string
    pricePerSqm: string
    maintenanceFee: string
  }
  tags: string[]
}

export function FeaturedProperty({
  title,
  location,
  description,
  price,
  images,
  details,
  tags,
}: FeaturedPropertyProps) {  const [currentIndex, setCurrentIndex] = useState(1);
  
  // ข้อมูลโครงการสำหรับแต่ละรูปภาพ
  const projectData = [
    {
      title: "THE GRAND RESIDENCE",
      subtitle: "บ้านจัดสรร",
      location: "สุขุมวิท - กรุงเทพฯ",
      description: "โครงการคอนโดมิเนียมสไตล์โมเดิร์นลักชัวรี่ ใกล้รถไฟฟ้า ตั้งอยู่ในทำเลศักยภาพ ใกล้ห้างสรรพสินค้า และสิ่งอำนวยความสะดวกครบครัน",
      details: {
        totalUnits: "406 ยูนิต",
        roomSize: "27-32.7 ตร.ม.",
        pricePerSqm: "(57,098 บาท/ตร.ม.)",
        maintenanceFee: "18 บาท"
      },
      price: "เริ่มต้น 5.5 ล้านบาท"
    },
    {
      title: "THE LUXE CONDOMINIUM",
      subtitle: "คอนโดมิเนียม",
      location: "พระรามเก้า - กรุงเทพฯ",
      description: "คอนโดมิเนียมระดับลักชัวรี่ใจกลางเมือง ดีไซน์หรู วัสดุพรีเมียม พื้นที่ส่วนกลางครบครัน ใกล้รถไฟฟ้า MRT และทางด่วน",
      details: {
        totalUnits: "325 ยูนิต",
        roomSize: "35-65 ตร.ม.",
        pricePerSqm: "(85,000 บาท/ตร.ม.)",
        maintenanceFee: "22 บาท"
      },
      price: "เริ่มต้น 6.8 ล้านบาท"
    },
    {
      title: "RIVERSIDE VILLA",
      subtitle: "บ้านเดี่ยว",
      location: "เจริญนคร - กรุงเทพฯ",
      description: "บ้านเดี่ยวริมแม่น้ำเจ้าพระยา บรรยากาศเงียบสงบ วิวสวย พื้นที่ใช้สอยกว้างขวาง เดินทางสะดวกทั้งทางน้ำและทางบก",
      details: {
        totalUnits: "150 ยูนิต",
        roomSize: "250-350 ตร.ม.",
        pricePerSqm: "(120,000 บาท/ตร.ม.)",
        maintenanceFee: "35 บาท"
      },
      price: "เริ่มต้น 15.5 ล้านบาท"
    }
  ];
  
  // คำนวณ index ที่จะแสดงทั้ง 3 รูป (ซ้าย กลาง ขวา)
  const displayedIndices = [
    (currentIndex - 1 + images.length) % images.length,
    currentIndex,
    (currentIndex + 1) % images.length,
  ];
  
  // ข้อมูลโครงการที่แสดงปัจจุบัน
  const currentProjectData = projectData[currentIndex % projectData.length];
    // ฟังก์ชั่นเลื่อนไปรูปถัดไป
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  // ฟังก์ชั่นเลื่อนไปรูปก่อนหน้า
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  // เลือกรูปโดยตรง
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (    <section className="py-10 bg-white text-gray-800">        <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 inline-block text-transparent bg-clip-text">โครงการใหม่ ใกล้รถไฟฟ้า เดินทางสะดวก</h2>
          <p className="mt-3 text-xl text-gray-600">เริ่มเพียง 5.2 ล้านบาท</p>
          <div className="h-1.5 w-48 bg-gradient-to-r from-blue-700 to-blue-500 mt-4 rounded-full mx-auto"></div>
        </div>
        <div className="relative flex justify-center items-center mb-5 h-[36rem] mx-auto max-w-7xl">
          {/* Images */}
          {displayedIndices.map((imageIndex, i) => {
            let position = "";
            let zIndex = 10;
            let scale = "scale-100"; 
              if (i === 0) { // รูปซ้าย
              position = "absolute left-1/2 transform -translate-x-[190%]";
              zIndex = 5;
              scale = "scale-85";
            } else if (i === 2) { // รูปขวา
              position = "absolute left-1/2 transform translate-x-[90%]";
              zIndex = 5;
              scale = "scale-85";
            } else { // รูปกลาง
              position = "absolute left-1/2 transform -translate-x-1/2";
              zIndex = 20;
              scale = "scale-125";
            }
              return (              <div
                key={i}
                className={`rounded-xl overflow-hidden ${position} ${scale} cursor-pointer`}
                style={{ zIndex }}
                onClick={i !== 1 ? () => goToSlide(imageIndex) : undefined}              ><div className={`${i === 1 ? "w-[700px] h-[400px]" : "w-[500px] h-[300px]"} overflow-hidden`}>
                  <Image
                    src={images[imageIndex] || "/placeholder.svg"}
                    alt={`${title} image ${imageIndex + 1}`}
                    width={1800}
                    height={1200}
                    className="w-full h-full object-cover shadow-lg"
                  />
                </div>
              </div>
            );
          })}        </div>        <div className="flex flex-col items-start mt-16 mx-auto max-w-2xl px-4">
          <div className="flex gap-2 mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="bg-[#006ce3] text-white px-4 py-1.5 text-sm font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>          <h3 className="text-2xl font-bold mb-1">{currentProjectData.title}</h3>
          <p className="text-gray-600 mb-4">{currentProjectData.location}</p>          <p className="text-gray-700 text-left mb-6">{currentProjectData.description}</p>          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-6 w-full">
            <div className="flex flex-col items-start">
              <p className="text-gray-500 text-sm mb-1">จำนวนยูนิตทั้งโครงการ</p>
              <p className="font-semibold">{currentProjectData.details.totalUnits}</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-gray-500 text-sm mb-1">ขนาดห้อง</p>
              <p className="font-semibold">{currentProjectData.details.roomSize}</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-gray-500 text-sm mb-1">ราคาต่อตารางเมตร</p>
              <p className="font-semibold">{currentProjectData.details.pricePerSqm}</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-gray-500 text-sm mb-1">ค่าส่วน</p>
              <p className="font-semibold">{currentProjectData.details.maintenanceFee}</p>
            </div>
          </div>          <div className="flex flex-col items-start mb-6 w-full">
            <p className="text-xl font-bold text-gray-800">{currentProjectData.price}</p>
          </div>

          <div className="w-full">
            <Button className="bg-[#006ce3] hover:bg-[#0055b3] rounded-full px-6 mt-2">ดูรายละเอียดโครงการ</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
