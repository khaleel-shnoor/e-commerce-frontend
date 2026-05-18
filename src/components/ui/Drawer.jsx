import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Drawer({ open, onClose, title, children, side = 'right' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const position = side === 'left' ? 'left-0' : 'right-0';
  const translate = open
    ? 'translate-x-0'
    : side === 'left'
      ? '-translate-x-full'
      : 'translate-x-full';

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-foreground/40 transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed top-0 z-50 h-full w-full max-w-md border-border bg-card transition-transform duration-300',
          side === 'left' ? 'border-r' : 'border-l',
          position,
          translate,
        )}
      >
        <header className="flex items-center justify-between border-b border-border p-4">
          {title && <h3 className="text-lg font-heading tracking-wide">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="overflow-y-auto p-4 h-[calc(100%-65px)]">{children}</div>
      </aside>
    </>
  );
}

