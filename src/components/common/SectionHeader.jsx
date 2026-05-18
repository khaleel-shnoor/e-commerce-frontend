import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SectionHeader({ title, subtitle, actionLabel, actionHref, className }) {
  return (
    <header className={cn('flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8', className)}>
      <div>
        {subtitle && (
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{subtitle}</p>
        )}
        <h2 className="text-3xl md:text-4xl font-heading tracking-wide">{title}</h2>
      </div>
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </header>
  );
}

