// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Specific object types with properly typed metadata
export interface Bike extends CosmicObject {
  type: 'bikes';
  metadata: {
    model_name: string;
    description?: string;
    price: string;
    sale_price?: string;
    on_sale?: boolean;
    main_image?: {
      url: string;
      imgix_url: string;
    };
    gallery_images?: Array<{
      url: string;
      imgix_url: string;
    }>;
    category?: Category;
    frame_material?: string;
    wheel_size?: string;
    weight?: string;
    sizes_available?: string;
    key_features?: string;
  };
}

export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name: string;
    description?: string;
    category_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface Story extends CosmicObject {
  type: 'stories';
  metadata: {
    headline: string;
    excerpt?: string;
    content: string;
    featured_image: {
      url: string;
      imgix_url: string;
    };
    author?: string;
    publish_date?: string;
  };
}

export interface Page extends CosmicObject {
  type: 'pages';
  metadata: {
    page_title: string;
    content: string;
    hero_image?: {
      url: string;
      imgix_url: string;
    };
    meta_description?: string;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Type guards for runtime validation
export function isBike(obj: CosmicObject): obj is Bike {
  return obj.type === 'bikes';
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}

export function isStory(obj: CosmicObject): obj is Story {
  return obj.type === 'stories';
}

export function isPage(obj: CosmicObject): obj is Page {
  return obj.type === 'pages';
}