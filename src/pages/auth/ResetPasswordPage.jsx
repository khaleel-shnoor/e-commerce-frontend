import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../lib/api';

export default function ResetPasswordPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = params.get('token');

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">New password</h1>
      <p className="text-muted-foreground text-sm mb-8">Create a strong new password</p>
      {!token ? (
        <p className="text-sm text-destructive mb-4">
          Invalid or missing reset token. Request a new link from{' '}
          <Link to="/forgot-password" className="underline">
            forgot password
          </Link>
          .
        </p>
      ) : null}
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!token) return;
          const form = new FormData(e.target);
          if (form.get('password') !== form.get('confirm')) {
            addToast('Passwords do not match', 'error');
            return;
          }
          setLoading(true);
          try {
            await authApi.resetPassword({
              token,
              new_password: form.get('password'),
            });
            addToast('Password updated', 'success');
            navigate('/login');
          } catch (err) {
            addToast(err.message || 'Reset failed', 'error');
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input
          label="New Password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <Input
          label="Confirm Password"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <Button type="submit" className="w-full" disabled={!token || loading}>
          {loading ? 'Updating…' : 'Update Password'}
        </Button>
      </form>
      <p className="text-sm text-center mt-6">
        <Link to="/login" className="hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
