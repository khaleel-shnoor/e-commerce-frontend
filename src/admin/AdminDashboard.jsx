import { PageWrapper } from '../components/common/PageWrapper';
import { StatsCard } from '../components/common/StatsCard';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { usePageLoading } from '../hooks/usePageLoading';
import { adminStats, revenueChartData, activityFeed } from '../data/analytics';
import { formatCurrency } from '../lib/utils';
import { DollarSign, ShoppingBag, Users, Store } from 'lucide-react';

export default function AdminDashboard() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Admin Dashboard" subtitle="Platform overview" loading={loading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" value={formatCurrency(adminStats.totalRevenue)} change={adminStats.growth.revenue} icon={DollarSign} />
        <StatsCard title="Orders" value={adminStats.totalOrders.toLocaleString()} change={adminStats.growth.orders} icon={ShoppingBag} />
        <StatsCard title="Users" value={adminStats.totalUsers.toLocaleString()} change={adminStats.growth.users} icon={Users} />
        <StatsCard title="Sellers" value={adminStats.totalSellers} change={adminStats.growth.sellers} icon={Store} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Revenue Overview</h3>
          <SimpleBarChart data={revenueChartData} />
        </section>
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {activityFeed.map((item) => (
              <li key={item.id} className="text-sm border-b border-border pb-3 last:border-0">
                <p>{item.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageWrapper>
  );
}
