import { getPage } from '@/lib/cosmic'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'About Trek - Our Mission & Story',
  description: 'Learn about Trek\'s mission to build the world\'s best bikes and change the world by getting more people on bikes.',
}

export default async function AboutPage() {
  const aboutPage = await getPage('about-trek')

  if (!aboutPage) {
    notFound()
  }

  const heroImage = aboutPage.metadata?.hero_image

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      {heroImage && (
        <section 
          className="relative h-[60vh] bg-cover bg-center bg-no-repeat flex items-center"
          style={{ backgroundImage: `url(${heroImage.imgix_url}?w=2000&fit=crop&auto=format,compress)` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {aboutPage.metadata?.page_title || aboutPage.title}
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Building the world's best bikes since 1976
            </p>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {!heroImage && (
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                {aboutPage.metadata?.page_title || aboutPage.title}
              </h1>
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: aboutPage.metadata?.content || '' }}
              className="leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Mission statement section */}
      <section className="py-16 bg-trek-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Quality</h3>
                <p className="text-gray-300">
                  We build only products we love, using the finest materials and most advanced technology available.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Hospitality</h3>
                <p className="text-gray-300">
                  We provide incredible hospitality to our customers, ensuring the best possible cycling experience.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Purpose</h3>
                <p className="text-gray-300">
                  We change the world by getting more people on bikes, making our communities better places to live and ride.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Innovation Since 1976</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-4">Pioneering Technology</h3>
                <p className="text-gray-600 mb-4">
                  From our wind tunnel in Wisconsin to the cobblestones of Belgium, we test our innovations in the harshest conditions.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• IsoSpeed comfort technology</li>
                  <li>• RE:aktiv shock technology</li>
                  <li>• OCLV Carbon manufacturing</li>
                  <li>• Project One customization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Racing Heritage</h3>
                <p className="text-gray-600 mb-4">
                  Our bikes have won the Tour de France, Olympics, and countless other races around the world.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Multiple Tour de France victories</li>
                  <li>• Olympic gold medal winners</li>
                  <li>• World Championship titles</li>
                  <li>• Professional team partnerships</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}