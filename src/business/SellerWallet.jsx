import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';


export default function SellerWallet() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Wallet & Earnings" loading={loading}>
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          Wallet & Earnings content with dummy data. Connect to your API when ready.
        </p>
      </section>
    </PageWrapper>
  );
}

