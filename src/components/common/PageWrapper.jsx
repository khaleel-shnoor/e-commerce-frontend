import { Breadcrumbs } from './Breadcrumbs';
import { PageSkeleton } from './Skeleton';
import { cn } from '../../lib/utils';

export function PageWrapper({
  title,
  subtitle,
  breadcrumbs = [],
  loading,
  children,
  actions,
  className,
}) {
  if (loading) {
    return (
      <div className={cn('container mx-auto px-4 py-8', className)}>
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
      {(title || actions) && (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            {subtitle && (
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{subtitle}</p>
            )}
            {title && <h1 className="text-3xl md:text-4xl font-heading tracking-wide">{title}</h1>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </div>
  );
}

