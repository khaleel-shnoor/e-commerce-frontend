import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency, formatDate } from '../lib/utils';
import { StatusBadge } from '../components/ui/Badge';
import { orderApi } from '../lib/api';

export default function CustomerOrders() {
  const pageLoading = usePageLoading();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    orderApi.list()
      .then((data) => {
        if (!cancelled) setOrders(data.items || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load orders');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const isLoading = pageLoading || loading;

  return (
    <PageWrapper title="My Orders" breadcrumbs={[{ label: 'Orders' }]} loading={isLoading}>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}
      {!isLoading && orders.length === 0 && !error ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          onAction={() => (window.location.href = '/shop')}
        />
      ) : (
        <DataTable
          columns={[
            { key: 'order_number', label: 'Order #' },
            { key: 'created_at', label: 'Date' },
            { key: 'status', label: 'Status' },
            { key: 'item_count', label: 'Items' },
            { key: 'total_amount', label: 'Total' },
          ]}
          data={orders}
          loading={isLoading}
          renderRow={(order) => (
            <>
              <td className="p-4">
                <Link to={`/account/orders/${order.id}`} className="font-medium hover:underline font-mono text-sm">
                  {order.order_number}
                </Link>
              </td>
              <td className="p-4 text-muted-foreground">{formatDate(order.created_at)}</td>
              <td className="p-4"><StatusBadge status={order.status} /></td>
              <td className="p-4">{order.item_count}</td>
              <td className="p-4 font-medium">{formatCurrency(order.total_amount)}</td>
            </>
          )}
        />
      )}
    </PageWrapper>
  );
}
