import { getSaleBikes, getCategories } from '@/lib/cosmic'
import BikeCard from '@/components/BikeCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sale - Trek Bike Deals & Clearance',
  description: 'Save up to 45% on select Trek bikes! Shop warehouse clearance deals on road bikes, mountain bikes, and more.',
}

export default async function SalePage() {
  const [saleBikes, categories] = await Promise.all([
    getSaleBikes(),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section 
        className="relative h-[50vh] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ 
          backgroundImage: `url(https://imgix.cosmicjs.com/f833e780-a455-11ed-81f2-f50e185dd248-vaPoJZB9Mzg.jpg?w=2000&fit=crop&auto=format,compress)`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Best. Bike deals. Ever.
          </h1>
          <p className="text-xl text-white mb-8">
            Save up to 45% on select Trek bikes for a limited time
          </p>
          <div className="inline-flex items-center gap-2 bg-trek-red text-white px-6 py-3 rounded-lg font-semibold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Limited Time Offer
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-64">
            <CategoryFilter 
              categories={categories} 
              showSaleFilter={false}
            />
          </aside>

          {/* Sale bikes grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sale Bikes</h2>
              <p className="text-gray-600">
                {saleBikes.length} {saleBikes.length === 1 ? 'bike' : 'bikes'} on sale
              </p>
            </div>

            {saleBikes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {saleBikes.map((bike) => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No sale bikes available</h3>
                <p className="text-gray-600 mb-6">
                  Check back soon for new deals and clearance bikes.
                </p>
                <a href="/bikes" className="btn-primary">
                  Browse All Bikes
                </a>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Additional sale info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Shop Trek Sales?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6">
                <div className="w-12 h-12 bg-trek-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Same Quality</h3>
                <p className="text-gray-600 text-sm">
                  Every Trek bike on sale meets our rigorous quality standards
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 bg-trek-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Full Warranty</h3>
                <p className="text-gray-600 text-sm">
                  All sale bikes come with Trek's complete warranty coverage
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 bg-trek-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Trek Care</h3>
                <p className="text-gray-600 text-sm">
                  30-day return policy and local dealer support included
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}