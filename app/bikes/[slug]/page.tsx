// app/bikes/[slug]/page.tsx
import { getBike, getBikes } from '@/lib/cosmic'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'

interface BikePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BikePageProps): Promise<Metadata> {
  const { slug } = await params
  const bike = await getBike(slug)
  
  if (!bike) {
    return {
      title: 'Bike Not Found - Trek Bikes'
    }
  }

  return {
    title: `${bike.metadata?.model_name || bike.title} - Trek Bikes`,
    description: bike.metadata?.description || `Discover the ${bike.metadata?.model_name || bike.title} from Trek.`,
  }
}

export async function generateStaticParams() {
  const bikes = await getBikes()
  return bikes.map((bike) => ({
    slug: bike.slug,
  }))
}

export default async function BikePage({ params }: BikePageProps) {
  const { slug } = await params
  const bike = await getBike(slug)

  if (!bike) {
    notFound()
  }

  const isOnSale = bike.metadata?.on_sale
  const salePrice = bike.metadata?.sale_price
  const regularPrice = bike.metadata?.price
  const mainImage = bike.metadata?.main_image
  const galleryImages = bike.metadata?.gallery_images || []
  const keyFeatures = bike.metadata?.key_features?.split('\n') || []

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link href="/" className="text-gray-600 hover:text-trek-blue">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/bikes" className="text-gray-600 hover:text-trek-blue">Bikes</Link>
            {bike.metadata?.category && (
              <>
                <span className="mx-2 text-gray-400">/</span>
                <Link 
                  href={`/bikes?category=${bike.metadata.category.slug}`}
                  className="text-gray-600 hover:text-trek-blue"
                >
                  {bike.metadata.category.metadata?.name || bike.metadata.category.title}
                </Link>
              </>
            )}
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{bike.metadata?.model_name || bike.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            {/* Main image */}
            <div className="aspect-square bg-gray-50 mb-4 rounded-lg overflow-hidden">
              {mainImage && (
                <img
                  src={`${mainImage.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                  alt={bike.metadata?.model_name || bike.title}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Gallery thumbnails */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-50 rounded overflow-hidden">
                    <img
                      src={`${image.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                      alt={`${bike.metadata?.model_name || bike.title} - Image ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bike details */}
          <div>
            {/* Sale badge */}
            {isOnSale && (
              <div className="mb-4">
                <span className="sale-badge">ON SALE</span>
              </div>
            )}

            <h1 className="text-3xl font-bold mb-4">
              {bike.metadata?.model_name || bike.title}
            </h1>

            {/* Pricing */}
            <div className="mb-6">
              {isOnSale && salePrice ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-trek-red">
                    {salePrice}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {regularPrice}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">
                  {regularPrice}
                </span>
              )}
            </div>

            {/* Description */}
            {bike.metadata?.description && (
              <div className="mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {bike.metadata.description}
                </p>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="mb-8">
              <AddToCartButton bike={bike} />
            </div>

            {/* Key Features */}
            {keyFeatures.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-trek-blue mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature.replace('•', '').trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bike.metadata?.frame_material && (
                  <div>
                    <dt className="font-medium text-gray-700">Frame Material</dt>
                    <dd className="text-gray-600">{bike.metadata.frame_material}</dd>
                  </div>
                )}
                {bike.metadata?.wheel_size && (
                  <div>
                    <dt className="font-medium text-gray-700">Wheel Size</dt>
                    <dd className="text-gray-600">{bike.metadata.wheel_size}</dd>
                  </div>
                )}
                {bike.metadata?.weight && (
                  <div>
                    <dt className="font-medium text-gray-700">Weight</dt>
                    <dd className="text-gray-600">{bike.metadata.weight}</dd>
                  </div>
                )}
                {bike.metadata?.sizes_available && (
                  <div>
                    <dt className="font-medium text-gray-700">Sizes Available</dt>
                    <dd className="text-gray-600">{bike.metadata.sizes_available}</dd>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex-1">
                Find a Retailer
              </button>
              <button className="btn-secondary flex-1">
                Compare
              </button>
            </div>

            {/* Support info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Trek Care</h4>
              <p className="text-sm text-gray-600 mb-2">
                Wherever you buy, we'll take care of you. If you're not in love with your bike, we'll take it back within 30 days.
              </p>
              <Link href="/support" className="text-trek-blue text-sm font-medium hover:underline">
                Learn more about Trek Care →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}