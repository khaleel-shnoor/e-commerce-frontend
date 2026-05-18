import { placeholderImage } from '../lib/utils';

const brands = ['NOIR', 'ESSENCE', 'FORM', 'LINEA', 'MONO', 'PURE'];

export const products = Array.from({ length: 24 }, (_, i) => {
  const id = i + 1;
  const price = 49 + (i % 8) * 35;
  const originalPrice = price + 40 + (i % 3) * 20;
  const categoryIds = ['apparel', 'footwear', 'accessories', 'outerwear'];
  const categoryId = categoryIds[i % categoryIds.length];

  return {
    id,
    slug: `product-${id}`,
    name: `${brands[i % brands.length]} ${['Classic Tee', 'Oxford Shirt', 'Slim Trouser', 'Leather Sneaker', 'Wool Coat', 'Canvas Tote', 'Merino Knit', 'Linen Blazer'][i % 8]}`,
    brand: brands[i % brands.length],
    description:
      'Premium minimalist design crafted for everyday elegance. Clean lines, exceptional materials, and timeless silhouette.',
    price,
    originalPrice,
    rating: 4 + (i % 10) / 10,
    reviewCount: 12 + i * 3,
    categoryId,
    tags: ['minimal', 'premium', 'new'],
    inStock: i % 7 !== 0,
    stock: 5 + (i % 20),
    isNew: i < 6,
    isTrending: i % 3 === 0,
    isFeatured: i % 4 === 0,
    isFlashSale: i % 5 === 0,
    flashDiscount: 15 + (i % 4) * 5,
    image: placeholderImage(600, 750, `P${id}`),
    images: [
      placeholderImage(600, 750, `P${id}A`),
      placeholderImage(600, 750, `P${id}B`),
      placeholderImage(600, 750, `P${id}C`),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Charcoal'],
    sellerId: `seller-${(i % 4) + 1}`,
  };
});

export function getProductById(id) {
  return products.find((p) => p.id === Number(id) || p.slug === id);
}

export function getProductsByCategory(categoryId) {
  return products.filter((p) => p.categoryId === categoryId);
}

export function searchProducts(query) {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)),
  );
}
