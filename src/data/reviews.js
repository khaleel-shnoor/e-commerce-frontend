import { placeholderImage } from '../lib/utils';

export const reviews = Array.from({ length: 16 }, (_, i) => ({
  id: `rev-${i + 1}`,
  productId: (i % 8) + 1,
  userId: `user-${(i % 2) + 1}`,
  userName: ['Alex Morgan', 'Jordan Lee', 'Taylor Kim', 'Casey Brooks'][i % 4],
  avatar: placeholderImage(80, 80, `U${i}`),
  rating: 3 + (i % 3),
  title: ['Perfect fit', 'Great quality', 'Timeless design', 'Worth every penny'][i % 4],
  content:
    'Exceptional craftsmanship and attention to detail. The fabric feels premium and the fit is exactly as described.',
  date: new Date(2025, 3, 1 + i).toISOString(),
  verified: i % 2 === 0,
  status: i % 5 === 0 ? 'pending' : 'approved',
}));

export const testimonials = [
  {
    id: 1,
    name: 'Elena Vasquez',
    role: 'Creative Director',
    content:
      'The most refined shopping experience I have had online. Every piece feels curated with intention.',
    avatar: placeholderImage(120, 120, 'EV'),
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Architect',
    content:
      'Clean aesthetics, fast delivery, and quality that exceeds expectations. My go-to for minimalist fashion.',
    avatar: placeholderImage(120, 120, 'MC'),
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Photographer',
    content:
      'Monochrome done right. Subtle, premium, and effortlessly stylish. Highly recommend.',
    avatar: placeholderImage(120, 120, 'PS'),
  },
];
