import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { refreshUser, isAuthenticated, role } = useAuth();
  const [status, setStatus] = useState(token ? 'loading' : 'missing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        await authApi.verifyEmail(token);
        if (!cancelled) {
          setStatus('success');
          setMessage('Your email has been verified.');
          if (isAuthenticated) await refreshUser();
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err.message || 'Verification failed');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, isAuthenticated, refreshUser]);

  const dashboard =
    role === 'admin' ? '/admin' : role === 'seller' ? '/seller' : '/account';

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Email verification</h1>

      {status === 'loading' && (
        <p className="text-muted-foreground text-sm">Verifying your email…</p>
      )}

      {status === 'missing' && (
        <p className="text-muted-foreground text-sm mb-6">
          No verification token found. Open the link from your email or sign in to request another.
        </p>
      )}

      {status === 'success' && (
        <p className="text-muted-foreground text-sm mb-6">{message}</p>
      )}

      {status === 'error' && <p className="text-destructive text-sm mb-6">{message}</p>}

      <Link
        to={isAuthenticated ? dashboard : '/login'}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm text-primary-foreground hover:opacity-90"
      >
        {isAuthenticated ? 'Continue to dashboard' : 'Sign in'}
      </Link>
    </div>
  );
}
