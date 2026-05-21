import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency } from '../lib/utils';

export default function CustomerWishlist() {
  const pageLoading = usePageLoading();
  const { wishlistItems, wishlistProducts, wishlistLoading, toggleWishlist, addToCart } = useCart();

  const loading = pageLoading || wishlistLoading;

  const handleRemove = (productId) => {
    toggleWishlist(productId);
  };

  const handleMoveToCart = (item) => {
    addToCart({
      id: item.product_id,
      name: item.product_name,
      price: item.product_price,
      primary_image_url: item.product_image_url,
      slug: item.product_slug,
    });
    toggleWishlist(item.product_id);
  };

  return (
    <PageWrapper title="Wishlist" loading={loading}>
      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Wishlist is empty"
          description="Save items you love for later. Browse the shop and tap the heart icon."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-border bg-card overflow-hidden flex flex-col"
            >
              <Link to={`/products/${item.product_slug}`} className="block aspect-[4/3] overflow-hidden bg-secondary">
                {item.product_image_url ? (
                  <img
                    src={item.product_image_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </Link>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <Link to={`/products/${item.product_slug}`} className="font-medium hover:underline line-clamp-2 text-sm">
                  {item.product_name}
                </Link>
                <p className="font-semibold">{formatCurrency(item.product_price)}</p>
                <div className="flex gap-2 mt-auto">
                  <Button
                    size="sm"
                    className="flex-1 flex items-center gap-1 justify-center"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Add to Cart
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.product_id)}
                    className="p-2 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
