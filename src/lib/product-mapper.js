import { placeholderImage } from './utils';

/** Map API product DTO to UI card/detail shape. */
export function mapApiProduct(p) {
  const price = Number(p.price);
  const compare = p.compare_at_price != null ? Number(p.compare_at_price) : null;
  const images =
    p.images?.length > 0
      ? p.images.map((img) => img.url)
      : p.primary_image_url
        ? [p.primary_image_url]
        : [placeholderImage(600, 750, p.name?.slice(0, 2) || 'P')];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand_name || p.store_name || 'SHNOOR',
    description: p.description || '',
    price,
    originalPrice: compare && compare > price ? compare : price,
    categoryId: p.category_id,
    categoryName: p.category_name,
    status: p.status,
    sku: p.sku,
    sellerId: p.seller_id,
    storeName: p.store_name,
    image: images[0],
    images,
    inStock: (p.quantity_available ?? 0) > 0,
    stock: p.quantity_available ?? 0,
    rating: 4.5,
    reviewCount: 0,
    isNew: false,
    isTrending: false,
    isFeatured: false,
    isFlashSale: compare != null && compare > price,
    flashDiscount: compare && compare > price ? Math.round((1 - price / compare) * 100) : 0,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
  };
}
