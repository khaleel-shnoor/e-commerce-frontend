import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/ui/Badge';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency, formatDate } from '../lib/utils';
import { sellerApi } from '../lib/api';

export default function SellerOrders() {
  const pageLoading = usePageLoading();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    sellerApi.orders({ limit: 100 })
      .then((data) => {
        if (!cancelled) {
          setOrders(data.items || []);
          setTotal(data.total || 0);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load orders');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const isLoading = pageLoading || loading;

  return (
    <PageWrapper title="Orders" loading={isLoading}>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {!isLoading && orders.length === 0 && !error ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Orders for your products will appear here once customers place them."
        />
      ) : (
        <>
          {total > 0 && (
            <p className="text-sm text-muted-foreground mb-4">{total} total order line(s)</p>
          )}
          <DataTable
            columns={[
              { key: 'order_number', label: 'Order #' },
              { key: 'ordered_at', label: 'Date' },
              { key: 'order_status', label: 'Status' },
              { key: 'product_name', label: 'Product' },
              { key: 'quantity', label: 'Qty' },
              { key: 'buyer', label: 'Buyer' },
              { key: 'line_total', label: 'Revenue' },
            ]}
            data={orders}
            loading={isLoading}
            renderRow={(row) => (
              <>
                <td className="p-4 font-mono text-sm">{row.order_number}</td>
                <td className="p-4 text-muted-foreground">{formatDate(row.ordered_at)}</td>
                <td className="p-4"><StatusBadge status={row.order_status} /></td>
                <td className="p-4 max-w-[200px] truncate">{row.product_name}</td>
                <td className="p-4">{row.quantity}</td>
                <td className="p-4">
                  <span className="text-sm">{row.buyer_name || row.buyer_email}</span>
                  <span className="block text-xs text-muted-foreground">{row.buyer_email}</span>
                </td>
                <td className="p-4 font-medium">{formatCurrency(row.line_total)}</td>
              </>
            )}
          />
        </>
      )}
    </PageWrapper>
  );
}
