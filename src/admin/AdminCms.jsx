import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';


export default function AdminCms() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="CMS Management" loading={loading}>
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          CMS Management content with dummy data. Connect to your API when ready.
        </p>
      </section>
    </PageWrapper>
  );
}

