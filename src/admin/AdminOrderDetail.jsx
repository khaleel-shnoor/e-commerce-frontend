import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { usePageLoading } from '../hooks/usePageLoading';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { adminApi } from '../lib/api';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageLoading = usePageLoading();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    adminApi.getOrder(id)
      .then((data) => {
        if (!cancelled) {
          setOrder(data);
          setSelectedStatus(data.status);
        }
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Order not found'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleStatusSave = async () => {
    if (!order || selectedStatus === order.status) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateOrderStatus(id, selectedStatus);
      setOrder(updated);
      setSelectedStatus(updated.status);
      addToast('Order status updated', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isLoading = pageLoading || loading;

  if (!isLoading && (error || !order)) {
    return (
      <PageWrapper title="Order Not Found">
        <p className="text-muted-foreground mb-4">{error || 'This order does not exist.'}</p>
        <Button variant="outline" onClick={() => navigate('/admin/orders')}>Back to Orders</Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={order?.order_number || 'Order Detail'}
      breadcrumbs={[{ label: 'Orders', href: '/admin/orders' }, { label: order?.order_number }]}
      loading={isLoading}
    >
      {order && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: items */}
          <section className="lg:col-span-2 space-y-6">
            <article className="rounded-xl border border-border bg-card p-6">
              <header className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Payment</p>
                  <p className="text-sm font-medium">{order.payment_method}</p>
                </div>
              </header>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-left">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Seller</th>
                      <th className="pb-3 font-medium text-right">Qty</th>
                      <th className="pb-3 font-medium text-right">Unit</th>
                      <th className="pb-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 pr-4 font-medium">{item.product_name}</td>
                        <td className="py-3 pr-4">
                          {item.seller_name ? (
                            <>
                              <p>{item.seller_name}</p>
                              {item.seller_email && (
                                <p className="text-xs text-muted-foreground">{item.seller_email}</p>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3 text-right">{item.quantity}</td>
                        <td className="py-3 text-right text-muted-foreground">{formatCurrency(item.unit_price)}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(item.line_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          {/* Right sidebar */}
          <aside className="space-y-4">
            {/* Status editor */}
            <section className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-heading tracking-wide text-sm font-medium">Update Status</h3>
              <Select
                options={ORDER_STATUSES}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleStatusSave}
                disabled={saving || selectedStatus === order.status}
              >
                {saving ? 'Saving…' : 'Save Status'}
              </Button>
            </section>

            {/* Buyer info */}
            <section className="rounded-xl border border-border bg-card p-6 space-y-2">
              <h3 className="font-heading tracking-wide text-sm font-medium">Buyer</h3>
              <p className="text-sm font-medium">{order.buyer_name || '—'}</p>
              <p className="text-sm text-muted-foreground">{order.buyer_email}</p>
            </section>

            {/* Order summary */}
            <section className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-heading tracking-wide text-sm font-medium">Order Summary</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>{formatCurrency(order.shipping_amount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span><span>{formatCurrency(order.tax_amount)}</span>
                </div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span><span>-{formatCurrency(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total</span><span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </section>

            {/* Shipping address */}
            {order.shipping_address && (
              <section className="rounded-xl border border-border bg-card p-6 space-y-2">
                <h3 className="font-heading tracking-wide text-sm font-medium">Shipping Address</h3>
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

            {/* Notes */}
            {order.notes && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-heading tracking-wide text-sm font-medium mb-2">Order Notes</h3>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </section>
            )}

            <Button variant="outline" className="w-full" onClick={() => navigate('/admin/orders')}>
              Back to Orders
            </Button>
          </aside>
        </div>
      )}
    </PageWrapper>
  );
}
