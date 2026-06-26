'use client'

import { useState } from 'react'
import { addToCart } from '@/lib/cart'
import type { Bike } from '@/types'

interface AddToCartButtonProps {
  bike: Bike;
  className?: string;
}

export default function AddToCartButton({ bike, className = '' }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')

  // Parse available sizes
  const availableSizes = bike.metadata?.sizes_available
    ? bike.metadata.sizes_available.split(',').map(size => size.trim())
    : []

  const hasMultipleSizes = availableSizes.length > 1

  const handleAddToCart = async () => {
    // If multiple sizes available but none selected, show error
    if (hasMultipleSizes && !selectedSize) {
      alert('Please select a size before adding to cart')
      return
    }

    setIsAdding(true)

    try {
      const cartItem = {
        id: bike.id,
        slug: bike.slug,
        title: bike.title,
        modelName: bike.metadata?.model_name || bike.title,
        price: bike.metadata?.price || '$0',
        salePrice: bike.metadata?.sale_price,
        onSale: bike.metadata?.on_sale || false,
        image: bike.metadata?.main_image,
      }

      addToCart(cartItem, hasMultipleSizes ? selectedSize : undefined)

      // Show success feedback
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Size selection */}
      {hasMultipleSizes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trek-blue focus:border-transparent"
          >
            <option value="">Select a size</option>
            {availableSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200
          ${showSuccess 
            ? 'bg-green-600 text-white' 
            : 'bg-trek-blue text-white hover:bg-blue-700 active:bg-blue-800'
          }
          ${isAdding ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {showSuccess ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Added to Cart!
          </span>
        ) : isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </span>
        ) : (
          'Add to Cart'
        )}
      </button>

      {/* Quick info */}
      <p className="text-sm text-gray-600 text-center">
        Free shipping on orders over $50
      </p>
    </div>
  )
}