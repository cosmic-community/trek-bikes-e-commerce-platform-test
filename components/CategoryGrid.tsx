import Link from 'next/link'
import { Category } from '@/types'

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 text-lg">Find the perfect bike for your riding style</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const categoryImage = category.metadata?.category_image
            
            return (
              <Link
                key={category.id}
                href={`/bikes?category=${category.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-square bg-gray-50">
                    {categoryImage && (
                      <img
                        src={`${categoryImage.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                        alt={category.metadata?.name || category.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-trek-blue transition-colors">
                      {category.metadata?.name || category.title}
                    </h3>
                    
                    {category.metadata?.description && (
                      <p className="text-gray-600 text-sm">
                        {category.metadata.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}