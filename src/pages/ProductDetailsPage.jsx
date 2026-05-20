import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Truck, RotateCcw, Shield } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { productsApi } from '../lib/api';
import { mapApiProduct } from '../lib/product-mapper';
import { formatCurrency, cn } from '../lib/utils';

export default function ProductDetailsPage() {
  const { slug: identifier } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [image, setImage] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    if (!identifier) return;
    setLoading(true);

    (async () => {
      try {
        const data = await productsApi.get(identifier);
        const mapped = mapApiProduct(data);
        setProduct(mapped);

        const list = await productsApi.list({
          category_id: data.category_id || undefined,
          limit: 8,
        });
        setRelated(
          (list.items || [])
            .map(mapApiProduct)
            .filter((p) => p.id !== mapped.id)
            .slice(0, 4),
        );
      } catch {
        setProduct(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [identifier]);

  if (!product && !loading) {
    return (
      <PageWrapper title="Product Not Found">
        <p className="text-muted-foreground">This product does not exist or is not available.</p>
        <Link to="/shop" className="underline mt-4 inline-block">
          Back to shop
        </Link>
      </PageWrapper>
    );
  }

  const wished = product ? isInWishlist(product.id) : false;

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Shop', href: '/shop' },
        { label: product?.name || 'Product' },
      ]}
      loading={loading}
    >
      {product && (
        <>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <div className="space-y-4">
              <figure className="aspect-[4/5] rounded-xl overflow-hidden border border-border bg-secondary">
                <img
                  src={product.images[image] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setImage(i)}
                      className={cn(
                        'h-20 w-16 shrink-0 rounded-lg overflow-hidden border-2',
                        image === i ? 'border-primary' : 'border-border',
                      )}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {product.brand}
                {product.storeName ? ` · ${product.storeName}` : ''}
              </p>
              <h1 className="text-3xl md:text-4xl font-heading tracking-wide mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(product.rating) ? 'fill-foreground' : 'text-muted',
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-semibold">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-8">{product.description}</p>

              {!product.inStock && (
                <p className="text-destructive text-sm mb-4">Out of stock</p>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border rounded-xl">
                  <button
                    type="button"
                    className="p-3"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{qty}</span>
                  <button
                    type="button"
                    className="p-3"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  className="flex-1"
                  disabled={!product.inStock}
                  onClick={() => {
                    addToCart(product, { quantity: qty });
                    addToast('Added to cart');
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    toggleWishlist(product.id);
                    addToast(wished ? 'Removed from wishlist' : 'Added to wishlist');
                  }}
                >
                  <Heart className={cn('h-4 w-4', wished && 'fill-foreground')} />
                </Button>
              </div>

              <ul className="space-y-3 text-sm text-muted-foreground border-t border-border pt-6">
                <li className="flex items-center gap-3">
                  <Truck className="h-4 w-4 shrink-0" /> Free shipping over $150
                </li>
                <li className="flex items-center gap-3">
                  <RotateCcw className="h-4 w-4 shrink-0" /> 30-day returns
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="h-4 w-4 shrink-0" /> Secure checkout
                </li>
              </ul>
            </div>
          </div>

          {related.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl tracking-wide mb-6">You may also like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </PageWrapper>
  );
}
