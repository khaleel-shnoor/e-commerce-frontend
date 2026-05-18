import { cn } from '../../lib/utils';

export function Textarea({ label, className, id, ...props }) {
  const textareaId = id || props.name;

  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <textarea
        id={textareaId}
        className={cn(
          'w-full min-h-[120px] px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y',
          className,
        )}
        {...props}
      />
    </label>
  );
}

