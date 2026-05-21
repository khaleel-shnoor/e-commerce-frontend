import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/ui/Badge';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency, formatDate } from '../lib/utils';
import { adminApi } from '../lib/api';

export default function AdminOrders() {
  const pageLoading = usePageLoading();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminApi.listOrders({ limit: 100 })
      .then((data) => {
        if (!cancelled) {
          setOrders(data.items || []);
          setTotal(data.total || 0);
        }
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load orders'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const isLoading = pageLoading || loading;

  return (
    <PageWrapper title="Orders Management" loading={isLoading}>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {!isLoading && orders.length === 0 && !error ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Platform orders will appear here once customers place them."
        />
      ) : (
        <>
          {total > 0 && (
            <p className="text-sm text-muted-foreground mb-4">{total} total orders</p>
          )}
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
                <td className="p-4 font-mono text-sm">{order.order_number}</td>
                <td className="p-4 text-muted-foreground">{formatDate(order.created_at)}</td>
                <td className="p-4"><StatusBadge status={order.status} /></td>
                <td className="p-4">{order.item_count}</td>
                <td className="p-4 font-medium">{formatCurrency(order.total_amount)}</td>
              </>
            )}
          />
        </>
      )}
    </PageWrapper>
  );
}
