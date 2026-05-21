import { useState, useEffect } from 'react';
import { PageWrapper } from '../components/common/PageWrapper';
import { StatsCard } from '../components/common/StatsCard';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { StatusBadge } from '../components/ui/Badge';
import { usePageLoading } from '../hooks/usePageLoading';
import { adminApi } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/utils';
import { DollarSign, ShoppingBag, Users, Store } from 'lucide-react';

export default function AdminDashboard() {
  const pageLoading = usePageLoading();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminApi.analytics()
      .then((data) => { if (!cancelled) setAnalytics(data); })
      .catch(() => {})
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
  }));
  const recentOrders = analytics?.recent_orders ?? [];

  return (
    <PageWrapper title="Admin Dashboard" subtitle="Platform overview" loading={isLoading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} />
        <StatsCard title="Orders" value={totalOrders.toLocaleString()} icon={ShoppingBag} />
        <StatsCard title="Users" value={totalUsers.toLocaleString()} icon={Users} />
        <StatsCard title="Sellers" value={totalSellers} icon={Store} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Revenue Overview</h3>
          {chartData.length > 0 ? (
            <SimpleBarChart data={chartData} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No revenue data yet.</p>
          )}
        </section>
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.slice(0, 8).map((order) => (
                <li key={order.id} className="text-sm border-b border-border pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.buyer_name || order.buyer_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                      <StatusBadge status={order.status} className="text-xs" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(order.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
