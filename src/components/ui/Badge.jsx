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
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    active: 'bg-foreground text-background',
    pending: 'bg-muted text-muted-foreground',
    shipped: 'bg-secondary text-foreground',
    delivered: 'bg-foreground text-background',
    cancelled: 'bg-muted text-muted-foreground line-through',
    open: 'border border-border',
    in_progress: 'bg-secondary',
    resolved: 'bg-muted text-muted-foreground',
    published: 'bg-foreground text-background',
    draft: 'bg-muted text-muted-foreground',
    inactive: 'bg-muted text-muted-foreground',
  };

  return (
    <Badge variant="outline" className={cn('capitalize', styles[status])}>
      {status?.replace('_', ' ')}
    </Badge>
  );
}

