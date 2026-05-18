import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';


export default function SellerStore() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Store Customization" loading={loading}>
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          Store Customization content with dummy data. Connect to your API when ready.
        </p>
      </section>
    </PageWrapper>
  );
}

