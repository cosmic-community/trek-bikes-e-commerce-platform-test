import { getStories } from '@/lib/cosmic'
import StoryGrid from '@/components/StoryGrid'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trek Stories - Latest News & Technology',
  description: 'Discover the latest Trek stories, technology innovations, and cycling insights from the world of Trek bikes.',
}

export default async function StoriesPage() {
  const stories = await getStories(12) // Get more stories for the dedicated page

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Trek Stories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the latest in Trek technology, cycling culture, and the adventures that inspire us every day.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => {
              const featuredImage = story.metadata?.featured_image
              const publishDate = story.metadata?.publish_date
              const author = story.metadata?.author
              
              return (
                <article key={story.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 group">
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
                    <h2 className="font-semibold text-xl mb-3 group-hover:text-trek-blue transition-colors">
                      <a href={`/stories/${story.slug}`}>
                        {story.metadata?.headline || story.title}
                      </a>
                    </h2>
                    
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
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No stories available</h3>
            <p className="text-gray-600">
              Check back soon for the latest Trek news and insights.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}