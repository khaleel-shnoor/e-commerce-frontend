import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency, formatDate } from '../lib/utils';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { orderApi } from '../lib/api';

export default function CustomerOrderDetails() {
  const { id } = useParams();
  const pageLoading = usePageLoading();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    orderApi.get(id)
      .then((data) => { if (!cancelled) setOrder(data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Order not found'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const isLoading = pageLoading || loading;

  if (!isLoading && (error || !order)) {
    return (
      <PageWrapper title="Order Not Found">
        <p className="text-muted-foreground mb-4">{error || 'This order does not exist.'}</p>
        <Link to="/account/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={order?.order_number || 'Order Details'}
      breadcrumbs={[{ label: 'Orders', href: '/account/orders' }, { label: order?.order_number }]}
      loading={isLoading}
    >
      {order && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: items */}
          <section className="lg:col-span-2 space-y-6">
            <article className="rounded-xl border border-border bg-card p-6">
              <header className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="text-sm font-medium">{order.payment_method}</p>
                </div>
              </header>

              <ul className="space-y-6 divide-y divide-border">
                {order.items.map((item) => (
                  <li key={item.id} className="flex gap-4 pt-6 first:pt-0">
                    {/* Product image */}
                    {item.product_image_url ? (
                      <img
                        src={item.product_image_url}
                        alt={item.product_name}
                        className="w-20 h-20 rounded-lg object-cover border border-border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg border border-border bg-muted flex items-center justify-center flex-shrink-0">
                        <Store className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-snug">{item.product_name}</p>

                      {/* Seller */}
                      {item.seller_name && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Sold by{' '}
                          {item.seller_slug ? (
                            <Link
                              to={`/store/${item.seller_slug}`}
                              className="text-foreground hover:underline font-medium"
                            >
                              {item.seller_name}
                            </Link>
                          ) : (
                            <span className="font-medium">{item.seller_name}</span>
                          )}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">Qty: {item.quantity}</span>
                        <span className="text-muted-foreground">{formatCurrency(item.unit_price)} each</span>
                      </div>
                    </div>

                    <p className="font-semibold text-sm whitespace-nowrap">{formatCurrency(item.line_total)}</p>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          {/* Right sidebar */}
          <aside className="space-y-4">
            <section className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-heading tracking-wide">Order Summary</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatCurrency(order.shipping_amount)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{formatCurrency(order.tax_amount)}</span></div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(order.discount_amount)}</span></div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total</span><span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </section>

            {order.shipping_address && (
              <section className="rounded-xl border border-border bg-card p-6 space-y-2">
                <h4 className="font-medium text-sm">Shipping Address</h4>
                <address className="text-sm text-muted-foreground not-italic space-y-0.5">
                  <p>{order.shipping_address.line1}</p>
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>
                    {order.shipping_address.city}
                    {order.shipping_address.state ? `, ${order.shipping_address.state}` : ''}
                    {' '}{order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </address>
              </section>
            )}

            {order.notes && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h4 className="font-medium text-sm mb-2">Order Notes</h4>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </section>
            )}

            <Link to="/account/orders">
              <Button variant="outline" className="w-full">Back to Orders</Button>
            </Link>
          </aside>
        </div>
      )}
    </PageWrapper>
  );
}
