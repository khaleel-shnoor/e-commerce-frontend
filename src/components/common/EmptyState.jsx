import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className }) {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl border border-dashed border-border bg-secondary/50',
        className,
      )}
    >
      {Icon && (
        <span className="mb-4 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </span>
      )}
      <h3 className="text-xl font-heading tracking-wide mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </section>
  );
}

