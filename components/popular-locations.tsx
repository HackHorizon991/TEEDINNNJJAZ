import Image from "next/image"
import Link from "next/link"

interface LocationItem {
  name: string
  image: string
  url: string
}

interface PopularLocationsProps {
  title: string
  locations: LocationItem[]
}

export function PopularLocations({ title, locations }: PopularLocationsProps) {
  return (
    <section className="py-12 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 inline-block text-transparent bg-clip-text">{title}</h2>
          <div className="h-1.5 w-32 bg-gradient-to-r from-blue-700 to-blue-500 mt-3 rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((location, index) => (            <Link
              href={location.url}
              key={index}
              className={`relative rounded-xl overflow-hidden group transition-transform duration-500 hover:scale-[1.02] shadow-lg ${
                index === 0
                  ? "md:col-span-1 h-[400px]"
                  : index === 1
                    ? "md:col-span-2 h-[400px]"
                    : index === 2
                      ? "md:col-span-2 h-[400px]"
                      : "md:col-span-1 h-[400px]"
              }`}
            >
              <Image
                src={location.image || "/placeholder.svg"}
                alt={location.name}
                fill
                className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-y-[-5px] transition-transform duration-300">
                <h3 className="text-2xl font-bold">{location.name}</h3>
                <div className="w-12 h-1 bg-blue-500 mt-2 rounded-full transform origin-left scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
