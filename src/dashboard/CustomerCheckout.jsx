import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency } from '../lib/utils';
import { addresses } from '../data/coupons';

export default function CustomerCheckout() {
  const loading = usePageLoading();
  const { subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const addr = addresses.find((a) => a.isDefault);

  return (
    <PageWrapper title="Checkout" loading={loading}>
      <form
        className="grid lg:grid-cols-2 gap-8"
        onSubmit={(e) => {
          e.preventDefault();
          clearCart();
          navigate('/account/payment-success');
        }}
      >
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading tracking-wide">Shipping</h3>
            <Input label="Full Name" defaultValue={addr?.name} required />
            <Input label="Address" defaultValue={addr?.street} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" defaultValue={addr?.city} required />
              <Input label="ZIP" defaultValue={addr?.zip} required />
            </div>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading tracking-wide">Payment</h3>
            <Input label="Card Number" placeholder="4242 4242 4242 4242" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry" placeholder="MM/YY" required />
              <Input label="CVC" placeholder="123" required />
            </div>
          </section>
        </div>
        <aside className="rounded-xl border border-border bg-card p-6 h-fit">
          <h3 className="font-heading tracking-wide mb-4">Order Total</h3>
          <p className="text-2xl font-semibold mb-6">{formatCurrency(subtotal + 12)}</p>
          <Button type="submit" className="w-full">Place Order</Button>
        </aside>
      </form>
    </PageWrapper>
  );
}
