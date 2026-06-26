// app/stories/[slug]/page.tsx
import { getStory, getStories } from '@/lib/cosmic'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface StoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory(slug)
  
  if (!story) {
    return {
      title: 'Story Not Found - Trek Stories'
    }
  }

  return {
    title: `${story.metadata?.headline || story.title} - Trek Stories`,
    description: story.metadata?.excerpt || 'Read the latest from Trek.',
  }
}

export async function generateStaticParams() {
  const stories = await getStories(20)
  return stories.map((story) => ({
    slug: story.slug,
  }))
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) {
    notFound()
  }

  const featuredImage = story.metadata?.featured_image
  const publishDate = story.metadata?.publish_date
  const author = story.metadata?.author

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link href="/" className="text-gray-600 hover:text-trek-blue">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/stories" className="text-gray-600 hover:text-trek-blue">Stories</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{story.metadata?.headline || story.title}</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Featured image */}
        {featuredImage && (
          <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden mb-8">
            <img
              src={`${featuredImage.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
              alt={story.metadata?.headline || story.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Story header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {story.metadata?.headline || story.title}
          </h1>
          
          {story.metadata?.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {story.metadata.excerpt}
            </p>
          )}
          
          {/* Meta info */}
          <div className="flex items-center text-gray-500 border-t pt-4">
            {author && (
              <span className="font-medium">By {author}</span>
            )}
            {author && publishDate && (
              <span className="mx-3">•</span>
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
        </header>

        {/* Story content */}
        <div className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: story.metadata?.content || '' }}
            className="leading-relaxed"
          />
        </div>

        {/* Back to stories */}
        <div className="mt-12 pt-8 border-t">
          <Link 
            href="/stories"
            className="inline-flex items-center text-trek-blue font-medium hover:underline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </Link>
        </div>
      </article>
    </div>
  )
}