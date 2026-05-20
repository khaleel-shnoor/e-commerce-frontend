import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Modal({ open, onClose, title, children, className, dismissible = true }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-foreground/40"
          onClick={dismissible ? onClose : undefined}
          aria-hidden
        />
        <section
          className={cn(
            'relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg',
            className,
          )}
          role="dialog"
        >
          <header className="mb-4 flex items-center justify-between">
            {title && <h3 className="text-xl font-heading tracking-wide">{title}</h3>}
            {dismissible && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-secondary transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </header>
          {children}
        </section>
      </div>
    </>
  );
}

