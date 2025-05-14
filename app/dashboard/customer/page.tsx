"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for customer dashboard
const viewsData = {
  labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  values: [800, 1800, 3000, 700, 1800, 3000, 1500, 1000, 2000, 1200, 2000, 3000],
}

const favoriteData = {
  labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  values: [12, 8, 18, 10, 23, 6, 15],
}

const recentViewedProperties = [
  { name: "คอนโด ริเวอร์ วิว", location: "พระราม 3", date: "10/05/2025" },
  { name: "บ้านเดี่ยว การ์เด้น วิลล่า", location: "รามอินทรา", date: "08/05/2025" },
  { name: "ทาวน์โฮม ซิตี้ โฮม", location: "บางนา", date: "05/05/2025" },
  { name: "คอนโด ลุมพินี เพลส", location: "อโศก", date: "01/05/2025" },
]

export default function CustomerDashboard() {
  const [viewsTimeframe, setViewsTimeframe] = useState("monthly")
  const [favoriteTimeframe, setFavoriteTimeframe] = useState("weekly")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">แดชบอร์ดสำหรับลูกค้า</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">ประกาศที่สนใจ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="text-sm text-gray-500 mt-1">อสังหาริมทรัพย์</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">การค้นหาล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm text-gray-500 mt-1">ครั้ง</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">การแจ้งเตือน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <div className="text-sm text-gray-500 mt-1">รายการใหม่</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Favorite Properties Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">ประกาศที่สนใจแต่ละวัน</CardTitle>
            <Select value={favoriteTimeframe} onValueChange={setFavoriteTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Weekly" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <WeeklyFavoriteChart data={favoriteData} />
            </div>
          </CardContent>
        </Card>

        {/* Recently Viewed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">ประกาศที่ดูล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentViewedProperties.map((property, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <div className="font-medium">{property.name}</div>
                    <div className="text-sm text-gray-500">{property.location}</div>
                  </div>
                  <div className="text-sm text-gray-400">{property.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Chart Component
function WeeklyFavoriteChart({ data }: { data: { labels: string[]; values: number[] } }) {
  const maxValue = Math.max(...data.values)

  return (
    <div className="w-full h-full flex items-end">
      <div className="flex-shrink-0 h-full flex flex-col justify-between pr-2">
        {[30, 20, 10, 0].map((value) => (
          <div key={value} className="text-sm text-gray-500">
            {value}
          </div>
        ))}
      </div>
      <div className="flex-1 flex items-end">
        {data.labels.map((label, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-6 ${index === 4 ? "bg-gray-600" : "bg-purple-200"} rounded-sm`}
              style={{
                height: `${(data.values[index] / maxValue) * 150}px`,
              }}
            ></div>
            <div className="text-xs mt-2">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
