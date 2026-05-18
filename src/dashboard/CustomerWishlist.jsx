import { PageWrapper } from '../components/common/PageWrapper';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { usePageLoading } from '../hooks/usePageLoading';
import { Heart } from 'lucide-react';

export default function CustomerWishlist() {
  const loading = usePageLoading();
  const { wishlistProducts } = useCart();

  return (
    <PageWrapper title="Wishlist" loading={loading}>
      {wishlistProducts.length === 0 ? (
        <EmptyState icon={Heart} title="Wishlist is empty" description="Save items you love for later." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
