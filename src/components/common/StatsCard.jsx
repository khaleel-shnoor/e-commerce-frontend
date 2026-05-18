import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatsCard({ title, value, change, icon: Icon, className }) {
  const isPositive = change >= 0;

  return (
    <article className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <header className="flex items-start justify-between mb-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        {Icon && (
          <span className="rounded-lg bg-secondary p-2">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </header>
      <p className="text-2xl md:text-3xl font-semibold mb-2">{value}</p>
      {change !== undefined && (
        <p className={cn('flex items-center gap-1 text-xs', isPositive ? 'text-foreground' : 'text-muted-foreground')}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(change)}% from last month
        </p>
      )}
    </article>
  );
}

