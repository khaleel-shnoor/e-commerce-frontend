import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency } from '../lib/utils';

export default function CustomerCart() {
  const loading = usePageLoading();
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const shipping = subtotal > 100 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  return (
    <PageWrapper title="Cart" loading={loading}>
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse our collection and add items you love."
          actionLabel="Shop Now"
          onAction={() => (window.location.href = '/shop')}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <ul className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                <img src={item.image} alt={item.name} className="w-24 h-28 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.size} / {item.color}</p>
                  <p className="font-semibold mt-2">{formatCurrency(item.price)}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-secondary">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-secondary">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-foreground">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="rounded-xl border border-border bg-card p-6 h-fit space-y-4">
            <h3 className="font-heading text-lg tracking-wide">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping ? formatCurrency(shipping) : 'Free'}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
            <Link to="/account/checkout">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </aside>
        </div>
      )}
    </PageWrapper>
  );
}

