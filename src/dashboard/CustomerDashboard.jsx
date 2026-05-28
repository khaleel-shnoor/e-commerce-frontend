import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, MapPin, Ticket } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { StatsCard } from '../components/common/StatsCard';
import { ProductCard } from '../components/product/ProductCard';
import { usePageLoading } from '../hooks/usePageLoading';
import { orders } from '../data/orders';
import { useCart } from '../context/CartContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { StatusBadge } from '../components/ui/Badge';
import { productsApi } from '../lib/api';
import { mapApiProduct } from '../lib/product-mapper';

const quickLinks = [
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/coupons', label: 'Coupons', icon: Ticket },
];

export default function CustomerDashboard() {
  const loading = usePageLoading();
  const { itemCount, wishlist } = useCart();
  const recentOrders = orders.slice(0, 3);

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    productsApi
      .recommendations()
      .then((data) => setRecommendations((data.items || []).map(mapApiProduct)))
      .catch(() => {});
  }, []);

  return (
    <PageWrapper title="Dashboard" subtitle="Welcome back" loading={loading}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Cart Items" value={itemCount} />
        <StatsCard title="Wishlist" value={wishlist.length} />
        <StatsCard title="Total Orders" value={orders.length} />
        <StatsCard title="Total Spent" value={formatCurrency(orders.reduce((s, o) => s + o.total, 0))} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 hover:bg-secondary transition-colors"
          >
            <link.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-6 mb-8">
        <h3 className="font-heading text-lg tracking-wide mb-4">Recent Orders</h3>
        <ul className="space-y-4">
          {recentOrders.map((order) => (
            <li key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4 last:border-0">
              <div>
                <Link to={`/account/orders/${order.id}`} className="font-medium hover:underline">
                  {order.id}
                </Link>
                <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} />
                <span className="font-medium">{formatCurrency(order.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {recommendations.length > 0 && (
        <section>
          <h3 className="font-heading text-lg tracking-wide mb-4">Recommended For You</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
