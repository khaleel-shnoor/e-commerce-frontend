import { PageWrapper } from '../components/common/PageWrapper';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { usePageLoading } from '../hooks/usePageLoading';
import { addresses } from '../data/coupons';

export default function CustomerAddresses() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Saved Addresses" loading={loading} actions={<Button>Add Address</Button>}>
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <article key={addr.id} className="rounded-xl border border-border bg-card p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium">{addr.label}</h3>
              {addr.isDefault && <Badge>Default</Badge>}
            </div>
            <address className="text-sm text-muted-foreground not-italic">
              {addr.name}<br />
              {addr.street}<br />
              {addr.city}, {addr.state} {addr.zip}<br />
              {addr.country}
            </address>
          </article>
        ))}
      </div>
    </PageWrapper>
  );
}
