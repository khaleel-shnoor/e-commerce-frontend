import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';


export default function SellerReviews() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Reviews & Ratings" loading={loading}>
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          Reviews & Ratings content with dummy data. Connect to your API when ready.
        </p>
      </section>
    </PageWrapper>
  );
}

