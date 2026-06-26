import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-trek-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/bikes?category=road" className="hover:text-white transition-colors">Road bikes</Link></li>
              <li><Link href="/bikes?category=mountain" className="hover:text-white transition-colors">Mountain bikes</Link></li>
              <li><Link href="/bikes?category=hybrid" className="hover:text-white transition-colors">Hybrid bikes</Link></li>
              <li><Link href="/bikes?category=electric" className="hover:text-white transition-colors">Electric bikes</Link></li>
              <li><Link href="/sale" className="hover:text-white transition-colors">Sale & clearance</Link></li>
            </ul>
          </div>

          {/* Inside Trek */}
          <div>
            <h3 className="font-semibold mb-4">INSIDE TREK</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">Heritage</Link></li>
              <li><Link href="/stories" className="hover:text-white transition-colors">Technology</Link></li>
              <li><Link href="/stories" className="hover:text-white transition-colors">Racing</Link></li>
              <li><Link href="/stories" className="hover:text-white transition-colors">Stories</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">SUPPORT</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/support" className="hover:text-white transition-colors">Customer service</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Contact us</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Warranty</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Product support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">LEGAL</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy policy & terms of use</Link></li>
              <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie policy</Link></li>
              <li><Link href="/recalls" className="hover:text-white transition-colors">Recalls</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © Trek Bicycle Corporation 2025
          </p>
          <p className="text-sm text-gray-400 mt-4 md:mt-0">
            UNITED STATES / ENGLISH
          </p>
        </div>
      </div>
    </footer>
  )
}