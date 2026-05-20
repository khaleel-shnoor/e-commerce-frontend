import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export function ProductCard({ product, className }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { addToast } = useToast();
  const wished = isInWishlist(product.id);

  return (
    <article className={cn('group relative', className)}>
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-xl border border-border bg-card">
        <figure className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
              NEW
            </span>
          )}
          {product.isFlashSale && (
            <span className="absolute right-3 top-3 rounded-full border border-border bg-card px-3 py-1 text-xs">
              -{product.flashDiscount}%
            </span>
          )}
        </figure>
        <div className="p-4 space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.brand}</p>
          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => {
            toggleWishlist(product.id);
            addToast(wished ? 'Removed from wishlist' : 'Added to wishlist');
          }}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-foreground')} />
        </Button>
        <Button
          variant="primary"
          size="icon"
          onClick={() => {
            addToCart(product);
            addToast('Added to cart');
          }}
          aria-label="Add to cart"
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}

