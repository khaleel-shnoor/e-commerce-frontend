import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';


export default function AdminSettings() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Settings" loading={loading}>
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          Settings content with dummy data. Connect to your API when ready.
        </p>
      </section>
    </PageWrapper>
  );
}

