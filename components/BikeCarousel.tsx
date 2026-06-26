import { Bike } from '@/types'
import BikeCard from './BikeCard'

interface BikeCarouselProps {
  title: string
  bikes: Bike[]
  showSaleBadges?: boolean
}

export default function BikeCarousel({ title, bikes, showSaleBadges = false }: BikeCarouselProps) {
  if (bikes.length === 0) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {showSaleBadges && (
            <p className="text-gray-600 text-lg">Limited time offers - save big on premium bikes</p>
          )}
        </div>
        
        {/* Horizontal scrolling carousel */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6" style={{ width: 'max-content' }}>
            {bikes.slice(0, 8).map((bike) => (
              <div key={bike.id} className="w-80 flex-shrink-0">
                <BikeCard bike={bike} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination dots - simplified for static display */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: Math.min(3, Math.ceil(bikes.length / 4)) }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-trek-black' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}