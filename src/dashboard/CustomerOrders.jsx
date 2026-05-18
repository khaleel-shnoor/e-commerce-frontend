import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { usePageLoading } from '../hooks/usePageLoading';
import { orders } from '../data/orders';
import { formatCurrency, formatDate } from '../lib/utils';
import { StatusBadge } from '../components/ui/Badge';

export default function CustomerOrders() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="My Orders" breadcrumbs={[{ label: 'Orders' }]} loading={loading}>
      <DataTable
        columns={[
          { key: 'id', label: 'Order' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
          { key: 'total', label: 'Total' },
        ]}
        data={orders}
        loading={loading}
        renderRow={(order) => (
          <>
            <td className="p-4">
              <Link to={`/account/orders/${order.id}`} className="font-medium hover:underline">
                {order.id}
              </Link>
            </td>
            <td className="p-4 text-muted-foreground">{formatDate(order.date)}</td>
            <td className="p-4"><StatusBadge status={order.status} /></td>
            <td className="p-4 font-medium">{formatCurrency(order.total)}</td>
          </>
        )}
      />
    </PageWrapper>
  );
}
