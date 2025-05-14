import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard, type PropertyData } from "@/components/property-card"
import Link from "next/link"

interface PropertySectionProps {
  title: string
  properties: PropertyData[]
}

export function PropertySection({ title, properties }: PropertySectionProps) {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-black to-black inline-block text-transparent bg-clip-text">{title}</h2>
        </div>
        <div className="flex items-center">
          <Link href="/all-properties">
  <Button 
  variant="outline"
  className="flex items-center gap-1.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md border-none transition-all rounded-full px-5 py-2 font-medium"
>
  <span>ดูทั้งหมด</span>
  <ChevronRight className="h-4 w-4" />
</Button>
</Link>
        </div>
      </div>      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {properties.map((property) => (
          <div key={property.id} className="transform transition-transform hover:-translate-y-1 hover:shadow-lg duration-300">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </section>
  )
}
