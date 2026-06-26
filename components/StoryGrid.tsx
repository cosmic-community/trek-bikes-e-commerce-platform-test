import Link from 'next/link'
import { Story } from '@/types'

interface StoryGridProps {
  stories: Story[]
  title?: string
}

export default function StoryGrid({ stories, title = "Latest Stories" }: StoryGridProps) {
  if (stories.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 text-lg">Discover the latest in Trek technology and cycling culture</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => {
            const featuredImage = story.metadata?.featured_image
            const publishDate = story.metadata?.publish_date
            const author = story.metadata?.author
            
            return (
              <Link key={story.id} href={`/stories/${story.slug}`} className="group block">
                <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
                  {/* Story image */}
                  {featuredImage && (
                    <div className="aspect-video bg-gray-50">
                      <img
                        src={`${featuredImage.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                        alt={story.metadata?.headline || story.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Story content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-3 group-hover:text-trek-blue transition-colors line-clamp-2">
                      {story.metadata?.headline || story.title}
                    </h3>
                    
                    {story.metadata?.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {story.metadata.excerpt}
                      </p>
                    )}
                    
                    {/* Meta info */}
                    <div className="flex items-center text-sm text-gray-500">
                      {author && (
                        <span>By {author}</span>
                      )}
                      {author && publishDate && (
                        <span className="mx-2">•</span>
                      )}
                      {publishDate && (
                        <span>
                          {new Date(publishDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
        
        {/* View all stories link */}
        <div className="text-center mt-12">
          <Link 
            href="/stories" 
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Stories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}