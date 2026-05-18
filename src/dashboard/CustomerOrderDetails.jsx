import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';
import { getOrderById } from '../data/orders';
import { formatCurrency, formatDate } from '../lib/utils';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function CustomerOrderDetails() {
  const { id } = useParams();
  const order = getOrderById(id);
  const loading = usePageLoading();

  if (!order && !loading) {
    return (
      <PageWrapper title="Order Not Found">
        <Link to="/account/orders"><Button variant="outline">Back to Orders</Button></Link>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={order?.id}
      breadcrumbs={[{ label: 'Orders', href: '/account/orders' }, { label: order?.id }]}
      loading={loading}
    >
      {order && (
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <article className="rounded-xl border border-border bg-card p-6">
              <header className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Placed on {formatDate(order.date)}</p>
                  <StatusBadge status={order.status} />
                </div>
                {order.trackingNumber && (
                  <p className="text-sm">Tracking: <span className="font-mono">{order.trackingNumber}</span></p>
                )}
              </header>
              <ul className="space-y-4">
                {order.items.map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.size} / {item.color} x{item.quantity}</p>
                      <p className="font-medium mt-1">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </section>
          <aside className="rounded-xl border border-border bg-card p-6 h-fit space-y-4">
            <h3 className="font-heading tracking-wide">Summary</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatCurrency(order.shipping)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
            <h4 className="font-medium text-sm pt-4">Shipping Address</h4>
            <address className="text-sm text-muted-foreground not-italic">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </address>
          </aside>
        </div>
      )}
    </PageWrapper>
  );
}

