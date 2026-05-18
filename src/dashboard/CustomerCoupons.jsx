import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';
import { coupons } from '../data/coupons';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function CustomerCoupons() {
  const loading = usePageLoading();
  const { addToast } = useToast();

  return (
    <PageWrapper title="Coupons" loading={loading}>
      <div className="grid md:grid-cols-2 gap-4">
        {coupons.map((c) => (
          <article key={c.id} className="rounded-xl border border-border bg-card p-6 flex justify-between items-center gap-4">
            <div>
              <p className="font-heading text-2xl tracking-wide">{c.code}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {c.type === 'percent' ? `${c.discount}% off` : `$${c.discount} off`} — Min. {c.minOrder}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Expires {c.expires}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {c.used ? <Badge variant="muted">Used</Badge> : (
                <Button size="sm" onClick={() => addToast(`Coupon ${c.code} copied`, 'success')}>Copy</Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </PageWrapper>
  );
}
