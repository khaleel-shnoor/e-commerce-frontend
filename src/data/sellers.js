import { placeholderImage } from '../lib/utils';

export const sellers = [
  {
    id: 'seller-1',
    name: 'NOIR Studio',
    email: 'contact@noirstudio.com',
    logo: placeholderImage(120, 120, 'NS'),
    banner: placeholderImage(1200, 400, 'NOIR'),
    rating: 4.8,
    products: 42,
    revenue: 128400,
    status: 'active',
    joinedAt: '2023-01-12',
  },
  {
    id: 'seller-2',
    name: 'ESSENCE Co.',
    email: 'hello@essence.co',
    logo: placeholderImage(120, 120, 'EC'),
    banner: placeholderImage(1200, 400, 'ESSENCE'),
    rating: 4.6,
    products: 28,
    revenue: 86400,
    status: 'active',
    joinedAt: '2023-05-20',
  },
  {
    id: 'seller-3',
    name: 'FORM Atelier',
    email: 'studio@formatelier.com',
    logo: placeholderImage(120, 120, 'FA'),
    banner: placeholderImage(1200, 400, 'FORM'),
    rating: 4.9,
    products: 56,
    revenue: 201600,
    status: 'active',
    joinedAt: '2022-09-03',
  },
  {
    id: 'seller-4',
    name: 'LINEA Collective',
    email: 'team@linea.com',
    logo: placeholderImage(120, 120, 'LC'),
    banner: placeholderImage(1200, 400, 'LINEA'),
    rating: 4.5,
    products: 19,
    revenue: 45200,
    status: 'pending',
    joinedAt: '2024-11-01',
  },
];

export function getSellerById(id) {
  return sellers.find((s) => s.id === id);
}
