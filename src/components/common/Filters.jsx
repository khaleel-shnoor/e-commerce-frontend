import { cn } from '../../lib/utils';
import { Select } from '../ui/Select';

export function Filters({ filters, onChange, className }) {
  return (
    <aside className={cn('space-y-4', className)}>
      {filters.map((filter) => (
        <Select
          key={filter.name}
          label={filter.label}
          name={filter.name}
          value={filter.value}
          onChange={(e) => onChange(filter.name, e.target.value)}
          options={filter.options}
        />
      ))}
    </aside>
  );
}

export function FilterChips({ options, active, onChange, className }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm border transition-colors',
            active === opt.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border hover:bg-secondary',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

