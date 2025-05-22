"use client"

import { useEffect, useRef, useState } from 'react'
import { MapPin, X, Maximize2, Minimize2 } from 'lucide-react'

// Add Leaflet type declaration
declare global {
  interface Window {
    L: any;
  }
}

interface PropertyData {
  id: string
  title: string
  location: string
  price: string
  isPricePerMonth?: boolean
  details: {
    area: number
    bedrooms: number
    bathrooms: number
    parking: number
  }
  image: string
  isForRent?: boolean
  isForSale?: boolean
  description?: string
  highlight?: string
  facilities?: string[]
  projectFacilities?: string[]
}

interface MapPanelProps {
  properties: PropertyData[]
  activeProperty: PropertyData | null
  setActiveProperty: (property: PropertyData | null) => void
  // Add new props for full screen functionality
  isFullScreen?: boolean
  onToggleFullScreen?: () => void
}

export default function MapPanel({
  properties,
  activeProperty,
  setActiveProperty,
  isFullScreen = false,
  onToggleFullScreen
}: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [showPropertyCard, setShowPropertyCard] = useState(false)

  // Load Leaflet CSS and JS
  useEffect(() => {
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        link.crossOrigin = ''
        document.head.appendChild(link)
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
        script.crossOrigin = ''
        script.onload = () => setLeafletLoaded(true)
        document.head.appendChild(script)
      } else {
        setLeafletLoaded(true)
      }
    }

    loadLeaflet()
  }, [])

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on Bangkok
    const map = window.L.map(mapRef.current).setView([13.7563, 100.5018], 12)

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    mapInstanceRef.current = map
    setMapLoaded(true)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [leafletLoaded])

  // Add property markers
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.L) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Add new markers for properties
    properties.slice(0, 50).forEach((property, index) => {
      // Generate realistic Bangkok coordinates for demo
      const hash = property.id.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)

      const lat = 13.7563 + (Math.abs(hash) % 200 - 100) / 1000 // Bangkok area
      const lng = 100.5018 + (Math.abs(hash * 2) % 200 - 100) / 1000

      // Create custom icon
      const isActive = activeProperty?.id === property.id
      const iconHtml = `
        <div class="relative">
          <div class="w-8 h-8 ${isActive ? 'bg-red-500' : 'bg-blue-600'} rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 ${isActive ? 'bg-red-500' : 'bg-blue-600'} text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-lg">
            ฿${property.price}
          </div>
        </div>
      `

      const customIcon = window.L.divIcon({
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: 'custom-marker'
      })

      const marker = window.L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)

      // Add click event
      marker.on('click', () => {
        setActiveProperty(property)
        setShowPropertyCard(true)
      })

      // Add popup
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-bold text-sm mb-1">${property.title}</h3>
          <p class="text-blue-600 font-bold">฿${property.price}${property.isPricePerMonth ? '/เดือน' : ''}</p>
          <p class="text-gray-600 text-xs mb-2">${property.location}</p>
          <div class="text-xs text-gray-500">
            ${property.details.bedrooms} ห้องนอน • ${property.details.bathrooms} ห้องน้ำ • ${property.details.area} ตร.ม.
          </div>
        </div>
      `
      marker.bindPopup(popupContent)

      markersRef.current.push(marker)
    })
  }, [mapLoaded, properties, activeProperty, setActiveProperty])

  // Handle active property changes
  useEffect(() => {
    if (activeProperty && mapInstanceRef.current) {
      setShowPropertyCard(true)

      // Find the corresponding marker and open its popup
      const propertyIndex = properties.findIndex(p => p.id === activeProperty.id)
      if (propertyIndex >= 0 && markersRef.current[propertyIndex]) {
        markersRef.current[propertyIndex].openPopup()
      }
    }
  }, [activeProperty, properties])

  // Update map size when isFullScreen changes
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [isFullScreen, mapLoaded]);

  return (
    <div className={`relative w-full h-full ${isFullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดแผนที่...</p>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Toggle Button */}
      {mapLoaded && onToggleFullScreen && (
        <button
          onClick={onToggleFullScreen}
          className="absolute top-4 right-4 z-[1001] bg-white p-2 rounded-md shadow-md hover:bg-gray-100"
          title={isFullScreen ? "ย่อแผนที่" : "ขยายแผนที่"}
        >
          {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      )}

      {/* Property Detail Card Overlay */}
      {showPropertyCard && activeProperty && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-[1000]">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg">{activeProperty.title}</h3>
            <button
              onClick={() => {
                setShowPropertyCard(false)
                setActiveProperty(null)
                // Close any open popups
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.closePopup()
                }
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-4">
            <img
              src={activeProperty.image}
              alt={activeProperty.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <div className="text-blue-600 font-bold text-xl mb-1">
                ฿{activeProperty.price}
                {activeProperty.isPricePerMonth && <span className="text-sm font-normal text-gray-500">/เดือน</span>}
              </div>
              <div className="text-gray-600 text-sm mb-2">{activeProperty.location}</div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>{activeProperty.details.bedrooms} ห้องนอน</span>
                <span>{activeProperty.details.bathrooms} ห้องน้ำ</span>
                <span>{activeProperty.details.area} ตร.ม.</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700"
              onClick={() => window.open(`/property/${activeProperty.id}`, '_blank')}
            >
              ดูรายละเอียด
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
              ติดต่อ
            </button>
          </div>
        </div>
      )}

      {/* Add custom CSS for markers */}
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 8px;
        }
      `}</style>
    </div>
  )
}