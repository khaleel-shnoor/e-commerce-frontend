import { useState, useEffect } from 'react';
import { PageWrapper } from '../components/common/PageWrapper';
import { StatsCard } from '../components/common/StatsCard';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { usePageLoading } from '../hooks/usePageLoading';
import { adminApi } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { DollarSign, ShoppingBag, Users, Store } from 'lucide-react';

export default function AdminAnalytics() {
  const pageLoading = usePageLoading();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminApi.analytics()
      .then((data) => { if (!cancelled) setAnalytics(data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load analytics'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const isLoading = pageLoading || loading;
  const totalRevenue = analytics?.total_revenue ?? 0;
  const totalOrders = analytics?.total_orders ?? 0;
  const totalUsers = analytics?.total_users ?? 0;
  const totalSellers = analytics?.total_sellers ?? 0;
  const chartData = (analytics?.revenue_by_month ?? []).map((d) => ({
    month: d.month,
    revenue: Number(d.revenue),
    orders: Number(d.orders),
  }));

  return (
    <PageWrapper title="Analytics" loading={isLoading}>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} />
        <StatsCard title="Total Orders" value={totalOrders.toLocaleString()} icon={ShoppingBag} />
        <StatsCard title="Total Users" value={totalUsers.toLocaleString()} icon={Users} />
        <StatsCard title="Total Sellers" value={totalSellers} icon={Store} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Revenue by Month</h3>
          {chartData.length > 0 ? (
            <SimpleBarChart data={chartData} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No revenue data yet. Revenue will appear here once orders are placed.</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Monthly Orders</h3>
          {chartData.length > 0 ? (
            <SimpleBarChart
              data={chartData.map((d) => ({ month: d.month, revenue: d.orders }))}
            />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No order data yet.</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="font-heading text-lg tracking-wide mb-2">Platform Summary</h3>
          <p className="text-sm text-muted-foreground mb-4">Key metrics across the entire platform</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Avg Order Value</p>
              <p className="text-xl font-semibold mt-1">
                {totalOrders > 0 ? formatCurrency(totalRevenue / totalOrders) : formatCurrency(0)}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Revenue / Seller</p>
              <p className="text-xl font-semibold mt-1">
                {totalSellers > 0 ? formatCurrency(totalRevenue / totalSellers) : formatCurrency(0)}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Orders / Seller</p>
              <p className="text-xl font-semibold mt-1">
                {totalSellers > 0 ? (totalOrders / totalSellers).toFixed(1) : '0'}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Users / Seller</p>
              <p className="text-xl font-semibold mt-1">
                {totalSellers > 0 ? (totalUsers / totalSellers).toFixed(1) : '0'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
