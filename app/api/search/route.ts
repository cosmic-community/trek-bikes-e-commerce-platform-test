import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

interface SearchResult {
  id: string
  title: string
  slug: string
  type: 'bikes' | 'stories' | 'pages'
  description?: string
  image?: string
}

// Error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const searchResults: SearchResult[] = []

    // Search bikes
    try {
      const bikesResponse = await cosmic.objects
        .find({ type: 'bikes' })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
        .limit(20)

      const bikes = bikesResponse.objects
      const filteredBikes = bikes.filter((bike: any) => 
        bike.title.toLowerCase().includes(query.toLowerCase()) ||
        bike.metadata?.model_name?.toLowerCase().includes(query.toLowerCase()) ||
        bike.metadata?.description?.toLowerCase().includes(query.toLowerCase()) ||
        bike.metadata?.category?.title?.toLowerCase().includes(query.toLowerCase())
      )

      filteredBikes.forEach((bike: any) => {
        searchResults.push({
          id: bike.id,
          title: bike.metadata?.model_name || bike.title,
          slug: bike.slug,
          type: 'bikes',
          description: bike.metadata?.description,
          image: bike.metadata?.main_image?.imgix_url
        })
      })
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
        .limit(20)

      const stories = storiesResponse.objects
      const filteredStories = stories.filter((story: any) => 
        story.title.toLowerCase().includes(query.toLowerCase()) ||
        story.metadata?.headline?.toLowerCase().includes(query.toLowerCase()) ||
        story.metadata?.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
        story.metadata?.author?.toLowerCase().includes(query.toLowerCase())
      )

      filteredStories.forEach((story: any) => {
        searchResults.push({
          id: story.id,
          title: story.metadata?.headline || story.title,
          slug: story.slug,
          type: 'stories',
          description: story.metadata?.excerpt,
          image: story.metadata?.featured_image?.imgix_url
        })
      })
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
        .limit(20)

      const pages = pagesResponse.objects
      const filteredPages = pages.filter((page: any) => 
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.metadata?.page_title?.toLowerCase().includes(query.toLowerCase()) ||
        page.metadata?.meta_description?.toLowerCase().includes(query.toLowerCase())
      )

      filteredPages.forEach((page: any) => {
        searchResults.push({
          id: page.id,
          title: page.metadata?.page_title || page.title,
          slug: page.slug,
          type: 'pages',
          description: page.metadata?.meta_description,
          image: page.metadata?.hero_image?.imgix_url
        })
      })
    } catch (error) {
      if (!hasStatus(error) || error.status !== 404) {
        console.error('Error searching pages:', error)
      }
    }

    // Sort results by relevance (exact matches first, then partial matches)
    searchResults.sort((a, b) => {
      const aExactMatch = a.title.toLowerCase() === query.toLowerCase()
      const bExactMatch = b.title.toLowerCase() === query.toLowerCase()
      
      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1
      
      const aStartsWith = a.title.toLowerCase().startsWith(query.toLowerCase())
      const bStartsWith = b.title.toLowerCase().startsWith(query.toLowerCase())
      
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
      
      return a.title.localeCompare(b.title)
    })

    // Limit to top 8 results for dropdown
    const limitedResults = searchResults.slice(0, 8)

    return NextResponse.json({ 
      results: limitedResults,
      total: searchResults.length 
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ 
      error: 'Search failed',
      results: [] 
    }, { status: 500 })
  }
}