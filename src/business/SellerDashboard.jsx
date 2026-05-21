import { useState, useEffect } from 'react';
import { PageWrapper } from '../components/common/PageWrapper';
import { StatsCard } from '../components/common/StatsCard';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/ui/Badge';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency, formatDate } from '../lib/utils';
import { sellerApi } from '../lib/api';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';

export default function SellerDashboard() {
  const pageLoading = usePageLoading();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    sellerApi.analytics()
      .then((data) => { if (!cancelled) setAnalytics(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const isLoading = pageLoading || loading;

  const revenue = analytics?.revenue ?? 0;
  const orders = analytics?.orders ?? 0;
  const products = analytics?.products ?? 0;
  const chartData = analytics?.revenue_by_month ?? [];
  const topProducts = analytics?.top_products ?? [];
  const recentOrders = analytics?.recent_orders ?? [];

  return (
    <PageWrapper title="Seller Dashboard" subtitle="Overview" loading={isLoading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Revenue" value={formatCurrency(revenue)} icon={DollarSign} />
        <StatsCard title="Orders" value={orders} icon={ShoppingBag} />
        <StatsCard title="Products" value={products} icon={Package} />
        <StatsCard title="Avg Order Value" value={orders > 0 ? formatCurrency(revenue / orders) : formatCurrency(0)} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Revenue by Month</h3>
          {chartData.length > 0 ? (
            <SimpleBarChart data={chartData.map((d) => ({ month: d.month, revenue: Number(d.revenue) }))} />
          ) : (
            <p className="text-sm text-muted-foreground">No revenue data yet.</p>
          )}
        </section>
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Top Products</h3>
          {topProducts.length > 0 ? (
            <ul className="space-y-3">
              {topProducts.map((p) => (
                <li key={p.id} className="flex justify-between text-sm border-b border-border pb-3 last:border-0">
                  <span className="truncate mr-2">{p.name}</span>
                  <span className="font-medium whitespace-nowrap">{formatCurrency(p.revenue)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No sales yet.</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg tracking-wide mb-4">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <DataTable
            columns={[
              { key: 'order_number', label: 'Order #' },
              { key: 'ordered_at', label: 'Date' },
              { key: 'order_status', label: 'Status' },
              { key: 'product_name', label: 'Product' },
              { key: 'buyer', label: 'Buyer' },
              { key: 'line_total', label: 'Revenue' },
            ]}
            data={recentOrders}
            renderRow={(row) => (
              <>
                <td className="p-4 font-mono text-sm">{row.order_number}</td>
                <td className="p-4 text-muted-foreground">{formatDate(row.ordered_at)}</td>
                <td className="p-4"><StatusBadge status={row.order_status} /></td>
                <td className="p-4 max-w-[160px] truncate">{row.product_name}</td>
                <td className="p-4 text-sm">{row.buyer_name || row.buyer_email}</td>
                <td className="p-4 font-medium">{formatCurrency(row.line_total)}</td>
              </>
            )}
          />
        )}
      </section>
    </PageWrapper>
  );
}
