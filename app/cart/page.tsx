'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCart, updateCartItemQuantity, removeFromCart, clearCart, formatPrice } from '@/lib/cart'
import type { Cart, CartItem } from '@/lib/cart'

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load cart data
    const loadCart = () => {
      const cartData = getCart()
      setCart(cartData)
      setIsLoading(false)
    }

    loadCart()

    // Listen for cart updates
    const handleCartUpdate = (event: CustomEvent<Cart>) => {
      setCart(event.detail)
    }

    window.addEventListener('cart-updated', handleCartUpdate as EventListener)
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate as EventListener)
    }
  }, [])

  const handleQuantityChange = (itemId: string, quantity: number, size?: string) => {
    const updatedCart = updateCartItemQuantity(itemId, quantity, size)
    setCart(updatedCart)
  }

  const handleRemoveItem = (itemId: string, size?: string) => {
    const updatedCart = removeFromCart(itemId, size)
    setCart(updatedCart)
  }

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      const emptyCart = clearCart()
      setCart(emptyCart)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trek-blue"></div>
            <span className="ml-2">Loading cart...</span>
          </div>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.32a1 1 0 00.95 1.32h9.46c.56 0 1.04-.37 1.18-.88L19 13M7 13v4a2 2 0 002 2h4m-6-2v-2m0 0h.01M17 21v-2a2 2 0 00-2-2h-4m6 4h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link 
              href="/bikes"
              className="inline-flex items-center px-6 py-3 bg-trek-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Shop Bikes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <CartItemRow 
                  key={`${item.id}-${item.selectedSize || 'no-size'}-${index}`}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    {cart.totalPrice >= 50 ? 'Free' : '$9.99'}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {formatPrice(cart.totalPrice + (cart.totalPrice >= 50 ? 0 : 9.99))}
                    </span>
                  </div>
                </div>
              </div>

              {cart.totalPrice < 50 && (
                <p className="text-sm text-gray-600 mb-4">
                  Add {formatPrice(50 - cart.totalPrice)} more for free shipping
                </p>
              )}

              <button className="w-full bg-trek-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
                Proceed to Checkout
              </button>
              
              <Link 
                href="/bikes"
                className="block text-center text-trek-blue hover:text-blue-700 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number, size?: string) => void;
  onRemove: (itemId: string, size?: string) => void;
}

function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const currentPrice = item.onSale && item.salePrice ? item.salePrice : item.price
  const itemTotal = parseFloat(currentPrice.replace(/[$,]/g, '')) * item.quantity

  return (
    <div className="border rounded-lg p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link href={`/bikes/${item.slug}`}>
            {item.image ? (
              <img
                src={`${item.image.imgix_url}?w=150&h=150&fit=crop&auto=format,compress`}
                alt={item.modelName}
                width={150}
                height={150}
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <Link 
                href={`/bikes/${item.slug}`}
                className="text-lg font-semibold hover:text-trek-blue"
              >
                {item.modelName}
              </Link>
              {item.selectedSize && (
                <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {item.onSale && item.salePrice ? (
                  <>
                    <span className="font-semibold text-trek-red">{item.salePrice}</span>
                    <span className="text-sm text-gray-500 line-through">{item.price}</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">SALE</span>
                  </>
                ) : (
                  <span className="font-semibold">{item.price}</span>
                )}
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove(item.id, item.selectedSize)}
              className="text-red-600 hover:text-red-800 p-2"
              title="Remove item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Quantity and Total */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Qty:</span>
              <div className="flex items-center border rounded">
                <button
                  onClick={() => onQuantityChange(item.id, item.quantity - 1, item.selectedSize)}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1 border-x">{item.quantity}</span>
                <button
                  onClick={() => onQuantityChange(item.id, item.quantity + 1, item.selectedSize)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="font-semibold">{formatPrice(itemTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}