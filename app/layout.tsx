import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trek Bikes - The World\'s Best Bikes and Cycling Gear',
  description: 'Discover Trek\'s complete range of bikes including road, mountain, electric, and hybrid bikes. Premium quality bikes backed by incredible customer service.',
  keywords: 'trek bikes, road bikes, mountain bikes, electric bikes, hybrid bikes, cycling gear',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}