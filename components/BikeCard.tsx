import Link from 'next/link'
import { Bike } from '@/types'

interface BikeCardProps {
  bike: Bike
  className?: string
}

export default function BikeCard({ bike, className = '' }: BikeCardProps) {
  const isOnSale = bike.metadata?.on_sale
  const salePrice = bike.metadata?.sale_price
  const regularPrice = bike.metadata?.price
  const mainImage = bike.metadata?.main_image
  
  return (
    <div className={`group ${className}`}>
      <Link href={`/bikes/${bike.slug}`}>
        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
          {/* Sale badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3 z-10">
              <span className="sale-badge">SALE</span>
            </div>
          )}
          
          {/* Compare button */}
          <button className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          {/* Bike image */}
          <div className="aspect-square bg-gray-50">
            {mainImage && (
              <img
                src={`${mainImage.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                alt={bike.metadata?.model_name || bike.title}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
          
          {/* Bike info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-trek-blue transition-colors">
              {bike.metadata?.model_name || bike.title}
            </h3>
            
            {/* Pricing */}
            <div className="flex items-center gap-2">
              {isOnSale && salePrice ? (
                <>
                  <span className="font-bold text-trek-red text-lg">
                    {salePrice}
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    {regularPrice}
                  </span>
                </>
              ) : (
                <span className="font-bold text-lg">
                  {regularPrice}
                </span>
              )}
            </div>

            {/* Category */}
            {bike.metadata?.category && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">
                  {bike.metadata.category.metadata?.name || bike.metadata.category.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}