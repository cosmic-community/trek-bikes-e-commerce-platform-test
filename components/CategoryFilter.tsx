import Link from 'next/link'
import { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
  showSaleFilter?: boolean
  saleOnly?: boolean
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  showSaleFilter = false, 
  saleOnly = false 
}: CategoryFilterProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/bikes"
              className={`block py-2 px-3 rounded transition-colors ${
                !selectedCategory 
                  ? 'bg-trek-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Bikes
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/bikes?category=${category.slug}`}
                className={`block py-2 px-3 rounded transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-trek-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.metadata?.name || category.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {showSaleFilter && (
        <div>
          <h3 className="font-semibold mb-4">Special Offers</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href={selectedCategory ? `/bikes?category=${selectedCategory}&sale=true` : '/bikes?sale=true'}
                className={`block py-2 px-3 rounded transition-colors ${
                  saleOnly
                    ? 'bg-trek-red text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                On Sale
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}