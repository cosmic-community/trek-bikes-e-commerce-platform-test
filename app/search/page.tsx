import { Suspense } from 'react'
import Link from 'next/link'
import { cosmic } from '@/lib/cosmic'
import { Bike, Story, Page } from '@/types'
import BikeCard from '@/components/BikeCard'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

interface SearchResult {
  bikes: Bike[]
  stories: Story[]
  pages: Page[]
  totalResults: number
}

// Error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

async function performSearch(query: string): Promise<SearchResult> {
  const results: SearchResult = {
    bikes: [],
    stories: [],
    pages: [],
    totalResults: 0
  }

  if (!query || query.length < 2) {
    return results
  }

  // Search bikes
  try {
    const bikesResponse = await cosmic.objects
      .find({ type: 'bikes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    const bikes = bikesResponse.objects as Bike[]
    results.bikes = bikes.filter((bike) => 
      bike.title.toLowerCase().includes(query.toLowerCase()) ||
      bike.metadata?.model_name?.toLowerCase().includes(query.toLowerCase()) ||
      bike.metadata?.description?.toLowerCase().includes(query.toLowerCase()) ||
      bike.metadata?.category?.title?.toLowerCase().includes(query.toLowerCase())
    )
  } catch (error) {
    if (!hasStatus(error) || error.status !== 404) {
      console.error('Error searching bikes:', error)
    }
  }

  // Search stories
  try {
    const storiesResponse = await cosmic.objects
      .find({ type: 'stories' })
      .props(['id', 'title', 'slug', 'metadata'])

    const stories = storiesResponse.objects as Story[]
    results.stories = stories.filter((story) => 
      story.title.toLowerCase().includes(query.toLowerCase()) ||
      story.metadata?.headline?.toLowerCase().includes(query.toLowerCase()) ||
      story.metadata?.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
      story.metadata?.author?.toLowerCase().includes(query.toLowerCase())
    )
  } catch (error) {
    if (!hasStatus(error) || error.status !== 404) {
      console.error('Error searching stories:', error)
    }
  }

  // Search pages
  try {
    const pagesResponse = await cosmic.objects
      .find({ type: 'pages' })
      .props(['id', 'title', 'slug', 'metadata'])

    const pages = pagesResponse.objects as Page[]
    results.pages = pages.filter((page) => 
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      page.metadata?.page_title?.toLowerCase().includes(query.toLowerCase()) ||
      page.metadata?.meta_description?.toLowerCase().includes(query.toLowerCase())
    )
  } catch (error) {
    if (!hasStatus(error) || error.status !== 404) {
      console.error('Error searching pages:', error)
    }
  }

  results.totalResults = results.bikes.length + results.stories.length + results.pages.length

  return results
}

async function SearchResults({ query }: { query: string }) {
  const searchResults = await performSearch(query)

  if (searchResults.totalResults === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-24 h-24 mx-auto mb-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
        <p className="text-gray-600 mb-8">
          We couldn't find anything matching "{query}". Try searching for bikes, stories, or pages.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">Suggestions:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/bikes" className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors">
              Browse all bikes
            </Link>
            <Link href="/stories" className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors">
              Read stories
            </Link>
            <Link href="/sale" className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors">
              View sale items
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Bikes Section */}
      {searchResults.bikes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Bikes ({searchResults.bikes.length})
            </h2>
            <Link href="/bikes" className="text-trek-blue hover:text-trek-blue-dark font-medium">
              View all bikes →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.bikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        </section>
      )}

      {/* Stories Section */}
      {searchResults.stories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Stories ({searchResults.stories.length})
            </h2>
            <Link href="/stories" className="text-trek-blue hover:text-trek-blue-dark font-medium">
              View all stories →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.stories.map((story) => (
              <article key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/stories/${story.slug}`}>
                  {story.metadata?.featured_image && (
                    <img
                      src={`${story.metadata.featured_image.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
                      alt={story.metadata?.headline || story.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-trek-blue transition-colors">
                      {story.metadata?.headline || story.title}
                    </h3>
                    {story.metadata?.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {story.metadata.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {story.metadata?.author && (
                        <span>By {story.metadata.author}</span>
                      )}
                      {story.metadata?.publish_date && (
                        <span>
                          {new Date(story.metadata.publish_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Pages Section */}
      {searchResults.pages.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Pages ({searchResults.pages.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.pages.map((page) => (
              <article key={page.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/${page.slug}`}>
                  {page.metadata?.hero_image && (
                    <img
                      src={`${page.metadata.hero_image.imgix_url}?w=800&h=300&fit=crop&auto=format,compress`}
                      alt={page.metadata?.page_title || page.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-trek-blue transition-colors">
                      {page.metadata?.page_title || page.title}
                    </h3>
                    {page.metadata?.meta_description && (
                      <p className="text-gray-600">
                        {page.metadata.meta_description}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search Results for "${query}"` : 'Search'}
          </h1>
          {query && (
            <p className="text-gray-600">
              Find bikes, stories, and pages related to your search
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {query ? (
          <Suspense fallback={
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-trek-blue border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Searching...</span>
              </div>
            </div>
          }>
            <SearchResults query={query} />
          </Suspense>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto mb-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Trek</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Use the search bar above to find bikes, stories, and pages. Try searching for specific bike models, categories, or topics you're interested in.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}