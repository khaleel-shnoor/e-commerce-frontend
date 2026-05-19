import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-secondary text-secondary-foreground',
  outline: 'border border-border text-foreground',
  muted: 'bg-muted text-muted-foreground',
};

export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Status pills with explicit contrast in light and dark mode. */
const STATUS_STYLES = {
  active: 'border-transparent bg-primary text-primary-foreground',
  inactive: 'border-border bg-secondary text-secondary-foreground',
  pending: 'border-amber-300/80 bg-amber-100 text-amber-950 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-100',
  approved: 'border-emerald-300/80 bg-emerald-100 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-100',
  rejected: 'border-red-300/80 bg-red-100 text-red-950 line-through dark:border-red-800 dark:bg-red-950/60 dark:text-red-200',
  suspended: 'border-orange-300/80 bg-orange-100 text-orange-950 dark:border-orange-800 dark:bg-orange-950/60 dark:text-orange-200',
  shipped: 'border-sky-300/80 bg-sky-100 text-sky-950 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-100',
  delivered: 'border-transparent bg-primary text-primary-foreground',
  cancelled: 'border-border bg-muted text-muted-foreground line-through',
  open: 'border-border bg-card text-foreground',
  in_progress: 'border-violet-300/80 bg-violet-100 text-violet-950 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-100',
  resolved: 'border-border bg-muted text-muted-foreground',
  published: 'border-transparent bg-primary text-primary-foreground',
  draft: 'border-border bg-muted text-muted-foreground',
  confirmed: 'border-blue-300/80 bg-blue-100 text-blue-950 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-100',
  processing: 'border-violet-300/80 bg-violet-100 text-violet-950 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-100',
  refunded: 'border-border bg-muted text-muted-foreground',
};

const DEFAULT_STATUS_STYLE = 'border-border bg-secondary text-secondary-foreground';

export function StatusBadge({ status }) {
  const key = typeof status === 'string' ? status.toLowerCase() : 'unknown';
  const label = key.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        STATUS_STYLES[key] ?? DEFAULT_STATUS_STYLE,
      )}
    >
      {label}
    </span>
  );
}
