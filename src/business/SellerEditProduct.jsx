import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';


export default function SellerEditProduct() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Edit Product" loading={loading}>
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          Edit Product content with dummy data. Connect to your API when ready.
        </p>
      </section>
    </PageWrapper>
  );
}

