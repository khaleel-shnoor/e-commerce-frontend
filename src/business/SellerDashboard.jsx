import { PageWrapper } from '../components/common/PageWrapper';
import { StatsCard } from '../components/common/StatsCard';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { DataTable } from '../components/common/DataTable';
import { usePageLoading } from '../hooks/usePageLoading';
import { sellerStats, revenueChartData, topProducts, recentCustomers } from '../data/analytics';
import { formatCurrency } from '../lib/utils';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
export default function SellerDashboard() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Seller Dashboard" subtitle="Overview" loading={loading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Revenue" value={formatCurrency(sellerStats.revenue)} change={sellerStats.growth.revenue} icon={DollarSign} />
        <StatsCard title="Orders" value={sellerStats.orders} change={sellerStats.growth.orders} icon={ShoppingBag} />
        <StatsCard title="Products" value={sellerStats.products} icon={Package} />
        <StatsCard title="Conversion" value={`${sellerStats.conversion}%`} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Revenue</h3>
          <SimpleBarChart data={revenueChartData} />
        </section>
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-4">Top Products</h3>
          <ul className="space-y-3">
            {topProducts.map((p) => (
              <li key={p.id} className="flex justify-between text-sm border-b border-border pb-3 last:border-0">
                <span>{p.name}</span>
                <span className="font-medium">{formatCurrency(p.revenue)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Customer' },
          { key: 'email', label: 'Email' },
          { key: 'orders', label: 'Orders' },
          { key: 'spent', label: 'Spent' },
        ]}
        data={recentCustomers}
        renderRow={(row) => (
          <>
            <td className="p-4">{row.name}</td>
            <td className="p-4 text-muted-foreground">{row.email}</td>
            <td className="p-4">{row.orders}</td>
            <td className="p-4 font-medium">{formatCurrency(row.spent)}</td>
          </>
        )}
      />
    </PageWrapper>
  );
}
