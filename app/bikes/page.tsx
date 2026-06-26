import { getBikes, getCategories, getBikesByCategory, getCategory } from '@/lib/cosmic'
import BikeCard from '@/components/BikeCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Metadata } from 'next'

interface BikePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
  title: 'Trek Bikes - Complete Bike Collection',
  description: 'Browse Trek\'s complete collection of road bikes, mountain bikes, electric bikes, and hybrid bikes. Find your perfect ride.',
}

export default async function BikesPage({ searchParams }: BikePageProps) {
  const params = await searchParams
  const categorySlug = typeof params.category === 'string' ? params.category : undefined
  const saleOnly = params.sale === 'true'
  
  const [allBikes, categories, selectedCategory] = await Promise.all([
    categorySlug ? getBikesByCategory(categorySlug) : getBikes(),
    getCategories(),
    categorySlug ? getCategory(categorySlug) : Promise.resolve(null)
  ])

  // Filter for sale bikes if needed
  const bikes = saleOnly 
    ? allBikes.filter(bike => bike.metadata?.on_sale === true)
    : allBikes

  const pageTitle = selectedCategory 
    ? `${selectedCategory.metadata?.name || selectedCategory.title} Bikes`
    : saleOnly 
      ? 'Sale Bikes'
      : 'All Bikes'

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
          {selectedCategory?.metadata?.description && (
            <p className="text-xl text-gray-600 max-w-3xl">
              {selectedCategory.metadata.description}
            </p>
          )}
          {saleOnly && (
            <p className="text-xl text-gray-600">
              Save up to 45% on select bikes for a limited time!
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-64">
            <CategoryFilter 
              categories={categories} 
              selectedCategory={categorySlug}
              showSaleFilter={true}
              saleOnly={saleOnly}
            />
          </aside>

          {/* Bike grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {bikes.length} {bikes.length === 1 ? 'bike' : 'bikes'}
              </p>
            </div>

            {bikes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bikes.map((bike) => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No bikes found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or browse all bikes.
                </p>
                <a href="/bikes" className="btn-primary">
                  View All Bikes
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}