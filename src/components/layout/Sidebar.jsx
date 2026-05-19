import { LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserAvatar } from '../common/UserAvatar';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function Sidebar({ links, title, basePath = '' }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isDesktop) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card min-h-[calc(100vh-4rem)] p-4 sticky top-16 flex flex-col">
      {title && (
        <h2 className="font-heading text-lg tracking-wide px-3 mb-4">{title}</h2>
      )}
      <nav className="space-y-1 flex-1">
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

      <div className="pt-4 mt-4 border-t border-border space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-2 min-w-0">
            <UserAvatar
              src={user.avatar_url}
              name={user.full_name || user.email}
              className="h-10 w-10 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
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
