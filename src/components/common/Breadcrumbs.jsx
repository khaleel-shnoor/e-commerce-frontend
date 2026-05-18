import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Breadcrumbs({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm text-muted-foreground flex-wrap', className)}>
      <Link to="/" className="hover:text-foreground transition-colors p-1">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" />
          {item.href && i < items.length - 1 ? (
            <Link to={item.href} className="hover:text-foreground transition-colors px-1">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground px-1">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

