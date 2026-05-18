import { placeholderImage } from '../lib/utils';

export const categories = [
  {
    id: 'apparel',
    name: 'Apparel',
    slug: 'apparel',
    description: 'Essential wardrobe pieces with refined tailoring.',
    productCount: 48,
    image: placeholderImage(800, 1000, 'Apparel'),
  },
  {
    id: 'footwear',
    name: 'Footwear',
    slug: 'footwear',
    description: 'Footwear designed for comfort and understated style.',
    productCount: 32,
    image: placeholderImage(800, 1000, 'Footwear'),
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Finishing touches that elevate every outfit.',
    productCount: 24,
    image: placeholderImage(800, 1000, 'Accessories'),
  },
  {
    id: 'outerwear',
    name: 'Outerwear',
    slug: 'outerwear',
    description: 'Layering pieces for every season.',
    productCount: 18,
    image: placeholderImage(800, 1000, 'Outerwear'),
  },
  {
    id: 'bags',
    name: 'Bags',
    slug: 'bags',
    description: 'Functional carry with architectural form.',
    productCount: 14,
    image: placeholderImage(800, 1000, 'Bags'),
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Curated objects for modern living.',
    productCount: 20,
    image: placeholderImage(800, 1000, 'Lifestyle'),
  },
];

export function getCategoryById(id) {
  return categories.find((c) => c.id === id || c.slug === id);
}
