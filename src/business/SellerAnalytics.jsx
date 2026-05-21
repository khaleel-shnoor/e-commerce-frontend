import { useState, useEffect } from 'react';
import { PageWrapper } from '../components/common/PageWrapper';
import { StatsCard } from '../components/common/StatsCard';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency } from '../lib/utils';
import { sellerApi } from '../lib/api';
import { DollarSign, ShoppingBag, Package, BarChart2 } from 'lucide-react';

export default function SellerAnalytics() {
  const pageLoading = usePageLoading();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    sellerApi.analytics()
      .then((data) => { if (!cancelled) setAnalytics(data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load analytics'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const isLoading = pageLoading || loading;
  const revenue = analytics?.revenue ?? 0;
  const orders = analytics?.orders ?? 0;
  const products = analytics?.products ?? 0;
  const chartData = (analytics?.revenue_by_month ?? []).map((d) => ({
    month: d.month,
    revenue: Number(d.revenue),
    orders: Number(d.orders),
  }));
  const topProducts = analytics?.top_products ?? [];

  return (
    <PageWrapper title="Analytics" loading={isLoading}>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" value={formatCurrency(revenue)} icon={DollarSign} />
        <StatsCard title="Total Orders" value={orders} icon={ShoppingBag} />
        <StatsCard title="Active Products" value={products} icon={Package} />
        <StatsCard title="Avg Order Value" value={orders > 0 ? formatCurrency(revenue / orders) : formatCurrency(0)} icon={BarChart2} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Monthly Revenue</h3>
          {chartData.length > 0 ? (
            <SimpleBarChart data={chartData} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No revenue data yet. Sales will appear here after your first order.</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Top Products by Revenue</h3>
          {topProducts.length > 0 ? (
            <ul className="space-y-4">
              {topProducts.map((p, idx) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} units sold</p>
                  </div>
                  <span className="font-semibold text-sm whitespace-nowrap">{formatCurrency(p.revenue)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No sales data yet.</p>
          )}
        </section>

        {chartData.length > 0 && (
          <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
            <h3 className="font-heading text-lg tracking-wide mb-4">Monthly Orders</h3>
            <SimpleBarChart
              data={chartData.map((d) => ({ month: d.month, revenue: d.orders }))}
            />
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
