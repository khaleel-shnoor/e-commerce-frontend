import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Truck, CreditCard, Smartphone, ChevronRight } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePageLoading } from '../hooks/usePageLoading';
import { formatCurrency } from '../lib/utils';
import { addressApi, orderApi } from '../lib/api';

export default function CustomerCheckout() {
  const pageLoading = usePageLoading();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Saved addresses from backend
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addrLoading, setAddrLoading] = useState(true);

  // New address fields — pre-filled from user profile where possible
  const [addrForm, setAddrForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'IN',
    label: 'Home',
    is_default: false,
  });

  // Contact fields — pre-filled from user profile
  const [contactForm, setContactForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const shipping = subtotal > 100 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  // Load saved addresses
  useEffect(() => {
    let cancelled = false;
    setAddrLoading(true);
    addressApi.list()
      .then((data) => {
        if (cancelled) return;
        setAddresses(data.items || []);
        const def = (data.items || []).find((a) => a.is_default);
        if (def) setSelectedAddressId(def.id);
        else if ((data.items || []).length === 0) setShowNewAddressForm(true);
      })
      .catch(() => {
        if (!cancelled) setShowNewAddressForm(true);
      })
      .finally(() => {
        if (!cancelled) setAddrLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleAddrChange = (field) => (e) =>
    setAddrForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleContactChange = (field) => (e) =>
    setContactForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    // Validate contact info
    if (!contactForm.full_name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!contactForm.phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    // Validate address
    const usingNew = showNewAddressForm || !selectedAddressId;
    if (usingNew) {
      if (!addrForm.line1.trim() || !addrForm.city.trim() || !addrForm.postal_code.trim()) {
        setError('Please complete the shipping address.');
        return;
      }
    }

    setSubmitting(true);
    try {
      // First sync cart to backend
      const { cartApi } = await import('../lib/api');
      // Clear existing backend cart and re-add from local
      await cartApi.clear().catch(() => {});
      for (const item of items) {
        await cartApi.add(item.productId, item.quantity).catch(() => {});
      }

      // Build checkout payload
      const payload = {
        notes: notes || null,
      };

      if (usingNew) {
        payload.new_address = {
          label: addrForm.label || 'Home',
          line1: addrForm.line1.trim(),
          line2: addrForm.line2.trim() || null,
          city: addrForm.city.trim(),
          state: addrForm.state.trim() || null,
          postal_code: addrForm.postal_code.trim(),
          country: addrForm.country || 'IN',
          is_default: addrForm.is_default,
        };
      } else {
        payload.shipping_address_id = selectedAddressId;
      }

      const order = await orderApi.checkout(payload);
      clearCart();
      navigate(`/account/payment-success?order=${order.order_number}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const loading = pageLoading || addrLoading;

  return (
    <PageWrapper title="Checkout" loading={loading}>
      <form className="grid lg:grid-cols-2 gap-8" onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Contact Info */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading tracking-wide text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
              Contact Information
            </h3>
            <Input
              label="Full Name"
              value={contactForm.full_name}
              onChange={handleContactChange('full_name')}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={contactForm.phone}
                onChange={handleContactChange('phone')}
                placeholder="+91 98765 43210"
                required
              />
              <Input
                label="Email"
                type="email"
                value={contactForm.email}
                onChange={handleContactChange('email')}
                required
              />
            </div>
          </section>

          {/* Shipping Address */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading tracking-wide text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
              Shipping Address
            </h3>

            {/* Saved addresses */}
            {addresses.length > 0 && (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAddressId === addr.id && !showNewAddressForm
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id && !showNewAddressForm}
                      onChange={() => {
                        setSelectedAddressId(addr.id);
                        setShowNewAddressForm(false);
                      }}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{addr.label || 'Address'}</p>
                      <p className="text-muted-foreground">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                        {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postal_code}<br />
                        {addr.country}
                      </p>
                    </div>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => { setShowNewAddressForm(true); setSelectedAddressId(null); }}
                  className={`flex items-center gap-2 text-sm p-3 rounded-lg border w-full cursor-pointer transition-colors ${
                    showNewAddressForm
                      ? 'border-primary bg-primary/5'
                      : 'border-dashed border-border hover:border-primary/50'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Use a new address
                </button>
              </div>
            )}

            {/* New address form */}
            {(showNewAddressForm || addresses.length === 0) && (
              <div className="space-y-3">
                {addresses.length > 0 && (
                  <p className="text-sm font-medium text-muted-foreground">New Address</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Label (e.g. Home)"
                    value={addrForm.label}
                    onChange={handleAddrChange('label')}
                    placeholder="Home"
                  />
                  <Input
                    label="Country Code"
                    value={addrForm.country}
                    onChange={handleAddrChange('country')}
                    placeholder="IN"
                    maxLength={2}
                  />
                </div>
                <Input
                  label="Address Line 1"
                  value={addrForm.line1}
                  onChange={handleAddrChange('line1')}
                  placeholder="House/Flat No., Street"
                  required={showNewAddressForm}
                />
                <Input
                  label="Address Line 2 (optional)"
                  value={addrForm.line2}
                  onChange={handleAddrChange('line2')}
                  placeholder="Landmark, Area"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={addrForm.city}
                    onChange={handleAddrChange('city')}
                    required={showNewAddressForm}
                  />
                  <Input
                    label="State"
                    value={addrForm.state}
                    onChange={handleAddrChange('state')}
                  />
                </div>
                <Input
                  label="PIN Code"
                  value={addrForm.postal_code}
                  onChange={handleAddrChange('postal_code')}
                  placeholder="110001"
                  required={showNewAddressForm}
                />
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addrForm.is_default}
                    onChange={(e) => setAddrForm((p) => ({ ...p, is_default: e.target.checked }))}
                    className="rounded"
                  />
                  Save as default address
                </label>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading tracking-wide text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</span>
              Payment Method
            </h3>

            {/* COD — active */}
            <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-primary bg-primary/5 cursor-pointer">
              <input type="radio" name="payment" value="cod" defaultChecked readOnly className="accent-primary" />
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
              </div>
            </label>

            {/* Card — disabled */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 opacity-50 cursor-not-allowed select-none">
              <input type="radio" name="payment" value="card" disabled className="accent-primary" />
              <CreditCard className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Credit / Debit Card</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Rupay</p>
              </div>
              <span className="text-xs bg-secondary px-2 py-1 rounded-full font-medium">Coming Soon</span>
            </div>

            {/* UPI — disabled */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 opacity-50 cursor-not-allowed select-none">
              <input type="radio" name="payment" value="upi" disabled className="accent-primary" />
              <Smartphone className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium text-sm">UPI</p>
                <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm</p>
              </div>
              <span className="text-xs bg-secondary px-2 py-1 rounded-full font-medium">Coming Soon</span>
            </div>
          </section>

          {/* Order notes */}
          <section className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading tracking-wide text-base mb-3">Order Notes (optional)</h3>
            <textarea
              className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
              placeholder="Special instructions for delivery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
          </section>
        </div>

        {/* Order summary */}
        <aside className="space-y-4">
          <section className="rounded-xl border border-border bg-card p-6 space-y-4 sticky top-4">
            <h3 className="font-heading tracking-wide text-base">Order Summary</h3>

            {/* Items list */}
            <ul className="space-y-3 divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 pt-3 first:pt-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">{formatCurrency(Number(item.price) * item.quantity)}</p>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="space-y-2 text-sm pt-2 border-t border-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping ? formatCurrency(shipping) : 'Free'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={submitting || items.length === 0}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
              {!submitting && <ChevronRight className="h-4 w-4" />}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              By placing your order, you agree to our Terms & Conditions.
            </p>
          </section>
        </aside>
      </form>
    </PageWrapper>
  );
}
