import { getPage } from '@/lib/cosmic'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Customer Support - Trek Bikes',
  description: 'Get help with your Trek bike. Contact our customer support team for product questions, warranty service, parts, and more.',
}

export default async function SupportPage() {
  const supportPage = await getPage('customer-support')

  if (!supportPage) {
    notFound()
  }

  const heroImage = supportPage.metadata?.hero_image

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      {heroImage && (
        <section 
          className="relative h-[40vh] bg-cover bg-center bg-no-repeat flex items-center"
          style={{ backgroundImage: `url(${heroImage.imgix_url}?w=2000&fit=crop&auto=format,compress)` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {supportPage.metadata?.page_title || supportPage.title}
            </h1>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {!heroImage && (
            <h1 className="text-4xl font-bold mb-8">
              {supportPage.metadata?.page_title || supportPage.title}
            </h1>
          )}
          
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: supportPage.metadata?.content || '' }}
              className="leading-relaxed"
            />
          </div>

          {/* Additional support resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Warranty Information</h3>
              <p className="text-gray-600 mb-4">
                Learn about Trek's comprehensive warranty coverage and how to make a claim.
              </p>
              <a href="#" className="text-trek-blue font-medium hover:underline">
                View Warranty Details →
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Find a Retailer</h3>
              <p className="text-gray-600 mb-4">
                Connect with your local Trek dealer for hands-on support and service.
              </p>
              <a href="#" className="text-trek-blue font-medium hover:underline">
                Dealer Locator →
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Bike Registration</h3>
              <p className="text-gray-600 mb-4">
                Register your Trek bike to activate your warranty and help with recovery if stolen.
              </p>
              <a href="#" className="text-trek-blue font-medium hover:underline">
                Register Your Bike →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}