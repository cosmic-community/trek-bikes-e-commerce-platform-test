# Trek Bikes E-commerce Platform

![Trek Bikes Platform](https://imgix.cosmicjs.com/f7f04ed0-a455-11ed-81f2-f50e185dd248-M6XC789HLe8.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A premium e-commerce platform that showcases Trek's complete bicycle catalog with advanced filtering, detailed product pages, and integrated content management. Built with Next.js and powered by Cosmic CMS for seamless content updates.

## Features

- 🚴‍♂️ **Complete Bike Catalog** - Browse Trek's full range from road to mountain to electric bikes
- 🔍 **Advanced Filtering** - Filter by category, price, features, and specifications  
- 💰 **Sale Management** - Highlight special offers and promotional pricing
- 📱 **Responsive Design** - Optimized for all devices with premium Trek styling
- 📰 **Story Hub** - Latest Trek news, technology insights, and cycling content
- 🎨 **Premium UI** - Dark theme with high-quality photography and clean typography
- ⚡ **Fast Performance** - Next.js with optimized images and efficient data fetching

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=689925374e4011d3072fe0af&clone_repository=6899282b4e4011d3072fe0d6)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "External Web Content (https://www.trekbikes.com/us/en_US/) - HTML:\n\nTrek Bikes - The world's best bikes and cycling gear Skip to content {{ $t('header.link.login') }} United States / English {{ $t('header.link.account') }} {{ $t('login.register') }} Trek Bikes - The world's best bikes and cycling gear For a limited time, save up to 45% on select bikes! Wherever you buy, we'll take care of you Buy in-store or online. Pick up your bike at your local Trek shop or get it delivered right to your front door. EASY SHOPPING OPTIONS If you're not in love with your bike, we'll take it back within 30 days with no additional charge. Your local shop has the knowledge, products, and expertise to help you get the most out of your new bike. FIND A RETAILER "Our mission is to provide incredible hospitality, and the entire team is here to give you the absolute best experience. That's what we do. Whatever you need, we'll take care of you." – Laurie Koch, VP of Customer Care Our mission We build only products we love, provide incredible hospitality to our customers, and change the world by getting more people on bikes. Trek started in a small Wisconsin barn in 1976, but our founders always saw something bigger. Decades later, we're on a mission to make our world a better place to live and ride. Road bikes Mountain bikes Hybrid bikes Electric bikes Electra bikes Men's bikes Women's bikes Equipment Apparel Sale & clearance Customize How to buy online Financing Trek bike finder Find a bike shop Bike tours Heritage Technology Racing Social responsibility Stories Sustainability Work at Trek Podcast Ride Club Customer service Contact us Newsletter signup Returns Shipping & delivery Home delivery Warranty How to shop safely Manuals & user guides Product support Bike basics & safety Bike assembly Bike sizing & fit guides Bike registration Bike archive Suspension calculator Apparel sizing & fit guides Privacy policy & terms of use Accessibility Cookie policy California Transparency Act Recalls United States / English © Trek Bicycle Corporation 2025\n\nThis external web content is part of the context for the following conversation."

### Code Generation Prompt

> Clone the Trek website. Build it using Next.js and match the style.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic CMS** - Headless content management
- **React** - Component-based UI library

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the Trek bike store bucket

### Installation

1. Clone this repository
```bash
git clone <repository-url>
cd trek-bikes-platform
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your Cosmic credentials:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Bikes
```typescript
import { cosmic } from '@/lib/cosmic'

// Get all bikes with category data
const response = await cosmic.objects
  .find({ type: 'bikes' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

const bikes = response.objects
```

### Filtering by Category
```typescript
// Get bikes by category ID
const response = await cosmic.objects
  .find({ 
    type: 'bikes',
    'metadata.category': categoryId
  })
  .depth(1)
```

### Getting Stories
```typescript
// Get latest stories
const response = await cosmic.objects
  .find({ type: 'stories' })
  .props(['id', 'title', 'slug', 'metadata'])
  .sort('-created_at')
  .limit(6)
```

## Cosmic CMS Integration

This application integrates with four main Cosmic object types:

- **Bikes** - Complete product catalog with specifications, pricing, and images
- **Categories** - Bike categories (Road, Mountain, Electric, Hybrid)
- **Stories** - Blog posts and news content about Trek and cycling
- **Pages** - Static pages like About Trek and Customer Support

All content is managed through Cosmic CMS, allowing for easy updates to:
- Product information and pricing
- Sale status and promotional offers
- Story content and featured images  
- Page content and hero images
- Category descriptions and images

## Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production
Set these in your deployment platform:
- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key
- `COSMIC_WRITE_KEY` - Your Cosmic write key (if using forms/mutations)

The application will automatically use these environment variables to connect to your Cosmic CMS data.

<!-- README_END -->