import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Truck, RotateCcw, Shield } from 'lucide-react';
import { getProductById, products } from '../data/products';
import { reviews } from '../data/reviews';
import { PageWrapper } from '../components/common/PageWrapper';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency, cn } from '../lib/utils';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const product = getProductById(slug);
  const loading = usePageLoading();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Black');
  const [image, setImage] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { addToast } = useToast();

  if (!product && !loading) {
    return (
      <PageWrapper title="Product Not Found">
        <p className="text-muted-foreground">This product does not exist.</p>
        <Link to="/shop" className="underline mt-4 inline-block">Back to shop</Link>
      </PageWrapper>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product?.id);
  const related = products.filter((p) => p.categoryId === product?.categoryId && p.id !== product?.id).slice(0, 4);

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
                <img src={product.images[image] || product.image} alt={product.name} className="w-full h-full object-cover" />
              </figure>
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImage(i)}
                    className={cn(
                      'w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors',
                      image === i ? 'border-foreground' : 'border-border',
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-heading tracking-wide mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn('h-4 w-4', i < Math.floor(product.rating) ? 'fill-foreground' : 'text-muted')}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-semibold">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-8">{product.description}</p>

              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-sm font-medium mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={cn(
                          'h-10 w-10 rounded-xl border text-sm transition-colors',
                          size === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          'px-4 py-2 rounded-xl border text-sm transition-colors',
                          color === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary',
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">Quantity</p>
                  <div className="flex items-center border border-border rounded-xl">
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-secondary">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center">{qty}</span>
                    <button type="button" onClick={() => setQty(qty + 1)} className="p-3 hover:bg-secondary">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <Button
                  size="lg"
                  className="flex-1 min-w-[200px]"
                  onClick={() => {
                    addToCart(product, { size, color, quantity: qty });
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
                    addToast('Wishlist updated');
                  }}
                >
                  <Heart className={cn('h-5 w-5', isInWishlist(product.id) && 'fill-foreground')} />
                </Button>
              </div>

              <ul className="space-y-3 text-sm text-muted-foreground border-t border-border pt-6">
                <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free shipping over $100</li>
                <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> 30-day returns</li>
                <li className="flex items-center gap-2"><Shield className="h-4 w-4" /> Secure checkout</li>
              </ul>
            </div>
          </div>

          {productReviews.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-heading tracking-wide mb-6">Reviews</h2>
              <div className="space-y-4">
                {productReviews.slice(0, 3).map((r) => (
                  <article key={r.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={r.avatar} alt="" className="h-8 w-8 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{r.userName}</p>
                        <p className="text-xs text-muted-foreground">{r.title}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.content}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-heading tracking-wide mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </>
      )}
    </PageWrapper>
  );
}

