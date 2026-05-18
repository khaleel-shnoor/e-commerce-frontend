import { cn } from '../../lib/utils';

export function Input({ label, error, className, id, ...props }) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20',
          error && 'border-foreground',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-muted-foreground">{error}</p>}
    </div>
  );
}

