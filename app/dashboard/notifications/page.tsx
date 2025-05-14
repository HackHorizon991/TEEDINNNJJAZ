"use client"

import Image from "next/image"
import { format } from "date-fns"
import { th } from "date-fns/locale"

// Mock data for notifications
const notifications = [
  {
    id: "notif-1",
    type: "review",
    icon: "/icons/airbnb-icon.png",
    message: "Meg Griffin has left you a review. Both of your reviews from this trip are now public.",
    date: new Date("2023-03-01"),
  },
  {
    id: "notif-2",
    type: "review",
    icon: "/icons/airbnb-icon.png",
    message: "Cleveland Brown has left you a review. Both of your reviews from this trip are now public.",
    date: new Date("2023-02-26"),
  },
  {
    id: "notif-3",
    type: "invite",
    icon: "/icons/user-avatar-1.png",
    message: "Glenn accepted your invite to co-host Cheerful 2-bedroom home in the heart of Quahog",
    date: new Date("2022-04-25"),
  },
  {
    id: "notif-4",
    type: "invite",
    icon: "/icons/user-avatar-1.png",
    message: "Glenn accepted your invite to co-host Cozy 3BR home minutes from downtown Quahog",
    date: new Date("2022-03-06"),
  },
  {
    id: "notif-5",
    type: "email",
    icon: "/icons/airbnb-icon.png",
    message:
      "Please confirm your email address by clicking on the link we just emailed you. If you cannot find the email, you can request a new confirmation email or change your email address.",
    date: new Date("2022-03-01"),
  },
]

export default function NotificationsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">แจ้งเตือน</h1>

        <div className="space-y-6">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start">
              <div className="mr-4 mt-1">
                {notification.type === "invite" ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden relative">
                    <Image
                      src="/diverse-user-avatars.png"
                      alt="User avatar"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#006ce3] flex items-center justify-center text-white">
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
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[#202224] mb-1">{notification.message}</p>
                <p className="text-gray-500 text-sm">{format(notification.date, "MMMM d, yyyy", { locale: th })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
