"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Mock data for super admin dashboard
const userStatsData = {
  labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
  values: {
    customers: [1240, 1580, 1890, 2100, 2450],
    agents: [210, 250, 310, 340, 390],
    total: [1450, 1830, 2200, 2440, 2840],
  },
}

const platformMetricsData = {
  metrics: [
    { name: "จำนวนผู้เข้าชม", value: "584.2k", change: "+12.3%" },
    { name: "จำนวนประกาศใหม่", value: "6.8k", change: "+5.7%" },
    { name: "ยอดการติดต่อ", value: "29.4k", change: "+9.1%" },
    { name: "จำนวนธุรกรรม", value: "845", change: "+3.2%" },
  ],
}

const recentUsersData = [
  { name: "คุณกมล บุญศรี", type: "agent", status: "active", date: "10/05/2025" },
  { name: "คุณวิภา จันทร์เพ็ญ", type: "customer", status: "active", date: "10/05/2025" },
  { name: "คุณสมชาย พงษ์พัฒน์", type: "agent", status: "pending", date: "09/05/2025" },
  { name: "คุณนภา สุวรรณ", type: "customer", status: "active", date: "09/05/2025" },
  { name: "คุณพิชัย วงศ์สวัสดิ์", type: "agent", status: "active", date: "08/05/2025" },
]

const topPropertiesData = [
  { id: 1, name: "คอนโด ริเวอร์ วิว", location: "พระราม 3", views: 8432, agent: "คุณพิชัย" },
  { id: 2, name: "บ้านเดี่ยว การ์เด้น", location: "รามอินทรา", views: 6218, agent: "คุณกมล" },
  { id: 3, name: "ทาวน์โฮม ซิตี้", location: "บางนา", views: 5790, agent: "คุณสมชาย" },
  { id: 4, name: "คอนโด ลุมพินี", location: "อโศก", views: 4982, agent: "คุณกมล" },
  { id: 5, name: "บ้านเดี่ยว เดอะ แกรนด์", location: "บางนา", views: 4521, agent: "คุณพิชัย" },
]

export default function SuperAdminDashboard() {
  const [timeframe, setTimeframe] = useState("monthly")
  const [userTab, setUserTab] = useState("all")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">แดชบอร์ดสำหรับผู้ดูแลระบบ</h1>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {platformMetricsData.metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className={`ml-2 text-sm ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">ในเดือนนี้</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Growth Chart */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-medium">ผู้ใช้งานระบบ</CardTitle>
            <p className="text-sm text-gray-500">การเติบโตของผู้ใช้งานในระบบ</p>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Tabs value={userTab} onValueChange={setUserTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="customers">ลูกค้า</TabsTrigger>
                <TabsTrigger value="agents">เอเจนท์</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span className="text-xs">ผู้ใช้ทั่วไป</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                  <span className="text-xs">เอเจนท์</span>
                </div>
              </div>
            </div>

            <TabsContent value="all">
              <div className="h-[300px]">
                <UserGrowthChart 
                  data={{
                    labels: userStatsData.labels,
                    values: userStatsData.values.total
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent value="customers">
              <div className="h-[300px]">
                <UserGrowthChart 
                  data={{
                    labels: userStatsData.labels,
                    values: userStatsData.values.customers
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent value="agents">
              <div className="h-[300px]">
                <UserGrowthChart 
                  data={{
                    labels: userStatsData.labels,
                    values: userStatsData.values.agents
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">ผู้ใช้งานล่าสุด</CardTitle>
            <Button variant="outline" size="sm">ดูทั้งหมด</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsersData.map((user, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        {user.type === "agent" ? "เอเจนท์" : "ลูกค้า"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "active" ? "bg-green-100 text-green-700" : 
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {user.status === "active" ? "ใช้งาน" : "รออนุมัติ"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{user.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">อสังหาฯ ยอดนิยม</CardTitle>
            <Button variant="outline" size="sm">ดูทั้งหมด</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPropertiesData.map((property, index) => (
                <div key={index} className="border-b border-gray-100 pb-2">
                  <div className="flex justify-between">
                    <div className="font-medium">{property.name}</div>
                    <div className="text-sm font-medium">{property.views.toLocaleString()} ครั้ง</div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-sm text-gray-500">{property.location}</div>
                    <div className="text-xs text-gray-500">โดย: {property.agent}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">การจัดการระบบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">จัดการผู้ใช้งาน</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">อนุมัติประกาศ</Button>
            <Button className="bg-green-600 hover:bg-green-700">รายงานระบบ</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Chart Component
function UserGrowthChart({ data }: { data: { labels: string[]; values: number[] } }) {
  const maxValue = Math.max(...data.values) * 1.2

  return (
    <div className="w-full h-full flex items-end">
      <div className="flex-shrink-0 h-full flex flex-col justify-between pr-2">
        {Array.from({ length: 5 }, (_, i) => {
          const value = Math.round(maxValue - (i * (maxValue / 4)))
          return (
            <div key={i} className="text-sm text-gray-500">
              {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
            </div>
          )
        })}
      </div>
      <div className="flex-1 flex items-end">
        {data.labels.map((label, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-8 bg-blue-500 rounded-sm"
              style={{
                height: `${(data.values[index] / maxValue) * 250}px`,
              }}
            ></div>
            <div className="text-xs mt-2">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
