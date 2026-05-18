import { cn } from '../../lib/utils';

export function Select({ label, options = [], className, id, ...props }) {
  const selectId = id || props.name;

  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <select
        id={selectId}
        className={cn(
          'w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

