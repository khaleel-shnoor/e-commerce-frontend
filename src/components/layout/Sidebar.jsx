import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function Sidebar({ links, title, basePath = '' }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (!isDesktop) return null;

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card min-h-[calc(100vh-4rem)] p-4 sticky top-16">
      {title && (
        <h2 className="font-heading text-lg tracking-wide px-3 mb-4">{title}</h2>
      )}
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={`${basePath}${link.to}`}
            end={link.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )
            }
          >
            {link.icon && <link.icon className="h-4 w-4 shrink-0" />}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function MobileSidebarNav({ links, basePath = '' }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 lg:hidden scrollbar-hide">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={`${basePath}${link.to}`}
          end={link.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors shrink-0',
              isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-secondary',
            )
          }
        >
          {link.icon && <link.icon className="h-4 w-4" />}
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
