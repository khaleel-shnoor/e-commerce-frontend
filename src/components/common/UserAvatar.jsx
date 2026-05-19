import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function UserAvatar({ src, name, className, iconClassName }) {
  const initials = name
    ? name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} avatar` : 'Profile'}
        className={cn('rounded-full object-cover bg-secondary', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground',
        className,
      )}
      aria-hidden={!name}
      title={name}
    >
      {name ? (
        <span className="text-sm font-medium text-foreground">{initials}</span>
      ) : (
        <User className={cn('h-5 w-5', iconClassName)} />
      )}
    </div>
  );
}
