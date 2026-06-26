'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  slug: string
  type: 'bikes' | 'stories' | 'pages'
  description?: string
  image?: string
}

interface SearchBarProps {
  className?: string
  onSearch?: (query: string) => void
}

export default function SearchBar({ className = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search function with debouncing
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results)
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(query)
      setQuery('')
      setResults([])
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleResultClick = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const getResultLink = (result: SearchResult): string => {
    switch (result.type) {
      case 'bikes':
        return `/bikes/${result.slug}`
      case 'stories':
        return `/stories/${result.slug}`
      case 'pages':
        return `/${result.slug}`
      default:
        return '/'
    }
  }

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'bikes':
        return 'Bike'
      case 'stories':
        return 'Story'
      case 'pages':
        return 'Page'
      default:
        return type
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search bikes, stories..."
          className="w-64 px-4 py-2 pl-10 text-black bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trek-blue focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-trek-blue rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={getResultLink(result)}
                  onClick={handleResultClick}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  {result.image && (
                    <img
                      src={`${result.image}?w=60&h=60&fit=crop&auto=format,compress`}
                      alt={result.title}
                      className="w-12 h-12 object-cover rounded-lg mr-3 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    {result.description && (
                      <p className="text-sm text-gray-500 truncate">
                        {result.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="text-sm text-trek-blue hover:text-trek-blue-dark font-medium"
                >
                  View all results for "{query}" →
                </Link>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for bikes, stories, or pages</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}