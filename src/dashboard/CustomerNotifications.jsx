import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';
import { notifications } from '../data/coupons';
import { cn } from '../lib/utils';

export default function CustomerNotifications() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="Notifications" loading={loading}>
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={cn(
              'rounded-xl border border-border p-4',
              !n.read && 'bg-secondary',
            )}
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{n.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </PageWrapper>
  );
}

