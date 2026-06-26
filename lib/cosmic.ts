import { createBucketClient } from '@cosmicjs/sdk'
import { Bike, Category, Story, Page, CosmicResponse } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all bikes with category data
export async function getBikes(): Promise<Bike[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'bikes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as Bike[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching bikes:', error);
    throw new Error('Failed to fetch bikes');
  }
}

// Fetch bikes by category slug (first get category ID, then filter bikes)
export async function getBikesByCategory(categorySlug: string): Promise<Bike[]> {
  try {
    // First, get the category by slug to get its ID
    const categoryResponse = await cosmic.objects
      .findOne({ type: 'categories', slug: categorySlug })
      .props(['id']);
    
    if (!categoryResponse.object) {
      return [];
    }

    const categoryId = categoryResponse.object.id;

    // Now fetch bikes that have this category ID
    const response = await cosmic.objects
      .find({ 
        type: 'bikes',
        'metadata.category': categoryId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as Bike[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching bikes by category:', error);
    throw new Error('Failed to fetch bikes by category');
  }
}

// Fetch single bike by slug
export async function getBike(slug: string): Promise<Bike | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'bikes', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.object as Bike;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching bike:', error);
    throw new Error('Failed to fetch bike');
  }
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata']);
    return response.objects as Category[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

// Fetch single category by slug
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'categories', slug })
      .props(['id', 'title', 'slug', 'metadata']);
    return response.object as Category;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
}

// Fetch latest stories
export async function getStories(limit: number = 6): Promise<Story[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'stories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('-created_at')
      .limit(limit);
    return response.objects as Story[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching stories:', error);
    throw new Error('Failed to fetch stories');
  }
}

// Fetch single story by slug
export async function getStory(slug: string): Promise<Story | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'stories', slug })
      .props(['id', 'title', 'slug', 'metadata']);
    return response.object as Story;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching story:', error);
    throw new Error('Failed to fetch story');
  }
}

// Fetch single page by slug
export async function getPage(slug: string): Promise<Page | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'pages', slug })
      .props(['id', 'title', 'slug', 'metadata']);
    return response.object as Page;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching page:', error);
    throw new Error('Failed to fetch page');
  }
}

// Fetch sale bikes
export async function getSaleBikes(): Promise<Bike[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'bikes',
        'metadata.on_sale': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as Bike[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching sale bikes:', error);
    throw new Error('Failed to fetch sale bikes');
  }
}

// Search function for server-side use
export async function searchContent(query: string): Promise<{
  bikes: Bike[];
  stories: Story[];
  pages: Page[];
}> {
  const results = {
    bikes: [] as Bike[],
    stories: [] as Story[],
    pages: [] as Page[]
  };

  if (!query || query.length < 2) {
    return results;
  }

  // Search bikes
  try {
    const bikesResponse = await cosmic.objects
      .find({ type: 'bikes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    const bikes = bikesResponse.objects as Bike[];
    results.bikes = bikes.filter((bike) => 
      bike.title.toLowerCase().includes(query.toLowerCase()) ||
      bike.metadata?.model_name?.toLowerCase().includes(query.toLowerCase()) ||
      bike.metadata?.description?.toLowerCase().includes(query.toLowerCase()) ||
      bike.metadata?.category?.title?.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    if (!hasStatus(error) || error.status !== 404) {
      console.error('Error searching bikes:', error);
    }
  }

  // Search stories
  try {
    const storiesResponse = await cosmic.objects
      .find({ type: 'stories' })
      .props(['id', 'title', 'slug', 'metadata']);

    const stories = storiesResponse.objects as Story[];
    results.stories = stories.filter((story) => 
      story.title.toLowerCase().includes(query.toLowerCase()) ||
      story.metadata?.headline?.toLowerCase().includes(query.toLowerCase()) ||
      story.metadata?.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
      story.metadata?.author?.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    if (!hasStatus(error) || error.status !== 404) {
      console.error('Error searching stories:', error);
    }
  }

  // Search pages
  try {
    const pagesResponse = await cosmic.objects
      .find({ type: 'pages' })
      .props(['id', 'title', 'slug', 'metadata']);

    const pages = pagesResponse.objects as Page[];
    results.pages = pages.filter((page) => 
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      page.metadata?.page_title?.toLowerCase().includes(query.toLowerCase()) ||
      page.metadata?.meta_description?.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    if (!hasStatus(error) || error.status !== 404) {
      console.error('Error searching pages:', error);
    }
  }

  return results;
}