import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';


export default function AdminSellers() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Seller Management" loading={loading}>
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          Seller Management content with dummy data. Connect to your API when ready.
        </p>
      </section>
    </PageWrapper>
  );
}

