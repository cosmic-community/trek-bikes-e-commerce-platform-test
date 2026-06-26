'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import SearchBar from './SearchBar'
import { getCart } from '@/lib/cart'
import type { Cart } from '@/lib/cart'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 })
  const router = useRouter()

  useEffect(() => {
    // Load cart data
    const loadCart = () => {
      const cartData = getCart()
      setCart(cartData)
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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="bg-gray-900 text-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">TREK</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/bikes" className="hover:text-trek-blue font-medium">
              Bikes
            </Link>
            <Link href="/stories" className="hover:text-trek-blue font-medium">
              Stories
            </Link>
            <Link href="/about" className="hover:text-trek-blue font-medium">
              About
            </Link>
            <Link href="/support" className="hover:text-trek-blue font-medium">
              Support
            </Link>
            <Link href="/sale" className="hover:text-trek-red font-medium">
              Sale
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:block">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className="relative p-2 hover:text-trek-blue transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-trek-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700">
            <nav className="flex flex-col py-4 space-y-2">
              <Link 
                href="/bikes" 
                className="py-2 hover:text-trek-blue font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Bikes
              </Link>
              <Link 
                href="/stories" 
                className="py-2 hover:text-trek-blue font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Stories
              </Link>
              <Link 
                href="/about" 
                className="py-2 hover:text-trek-blue font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/support" 
                className="py-2 hover:text-trek-blue font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <Link 
                href="/sale" 
                className="py-2 hover:text-trek-red font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sale
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}