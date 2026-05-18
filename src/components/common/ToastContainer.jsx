import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../lib/utils';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  default: Info,
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || icons.default;
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lg animate-in',
            )}
            role="alert"
          >
            <Icon className="h-5 w-5 shrink-0" />
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

