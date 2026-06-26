import { getBikes, getCategories, getStories, getSaleBikes } from '@/lib/cosmic'
import HeroSection from '@/components/HeroSection'
import CategoryGrid from '@/components/CategoryGrid'
import BikeCarousel from '@/components/BikeCarousel'
import StoryGrid from '@/components/StoryGrid'

export default async function HomePage() {
  const [bikes, categories, stories, saleBikes] = await Promise.all([
    getBikes(),
    getCategories(),
    getStories(3),
    getSaleBikes()
  ])

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Let's Ride"
        subtitle="Meet the all-new Fuel and Fuel+"
        backgroundImage="https://imgix.cosmicjs.com/f7f04ed0-a455-11ed-81f2-f50e185dd248-M6XC789HLe8.jpg?w=2000&fit=crop&auto=format,compress"
        buttons={[
          { text: 'EXPLORE FUEL', href: '/bikes?search=fuel', variant: 'secondary' },
          { text: 'EXPLORE FUEL+', href: '/bikes?search=fuel+', variant: 'secondary' }
        ]}
      />

      {/* Sale Hero */}
      <section className="relative h-[60vh] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ 
          backgroundImage: `url(https://imgix.cosmicjs.com/f833e780-a455-11ed-81f2-f50e185dd248-vaPoJZB9Mzg.jpg?w=2000&fit=crop&auto=format,compress)`
        }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Best. Bike deals. Ever.
            </h2>
            <p className="text-xl text-white mb-8">
              Shop our warehouse clearance now
            </p>
            <div className="flex gap-4">
              <a href="/bikes?category=mountain&sale=true" className="btn-secondary">
                SAVE ON MOUNTAIN BIKES
              </a>
              <a href="/bikes?category=road&sale=true" className="btn-secondary">
                SAVE ON ROAD BIKES
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Bikes Carousel */}
      {saleBikes.length > 0 && (
        <>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                For a limited time, save up to 45% on select bikes!
              </h2>
            </div>
          </div>
          <BikeCarousel 
            title=""
            bikes={saleBikes} 
            showSaleBadges={true}
          />
        </>
      )}

      {/* Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* Project One Section */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">From dreams to dirt</h2>
          <p className="text-xl mb-8">Project One MTB is here</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/project-one" className="btn-primary">START YOUR DREAM BUILD</a>
            <a href="/project-one" className="btn-primary">EXPLORE PROJECT ONE MTB</a>
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      {bikes.length > 0 && (
        <BikeCarousel 
          title="Featured Bikes"
          bikes={bikes}
        />
      )}

      {/* Stories Section */}
      <StoryGrid stories={stories} />

      {/* Mission Section */}
      <section className="py-16 bg-trek-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-2xl italic mb-6">
              "Our mission is to provide incredible hospitality, and the entire team is here to give you the absolute best experience. That's what we do. Whatever you need, we'll take care of you."
            </blockquote>
            <cite className="text-gray-300">– Laurie Koch, VP of Customer Care</cite>
          </div>
          
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our mission</h2>
            <p className="text-lg leading-relaxed">
              We build only products we love, provide incredible hospitality to our customers, and change the world by getting more people on bikes. Trek started in a small Wisconsin barn in 1976, but our founders always saw something bigger. Decades later, we're on a mission to make our world a better place to live and ride.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}