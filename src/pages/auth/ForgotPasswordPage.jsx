import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../lib/api';

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const value = String(form.get('email') || '').trim();
    if (!value) return;

    setLoading(true);
    try {
      await authApi.forgotPassword(value);
      setEmail(value);
      setSent(true);
      addToast('If the email exists, a reset link was sent', 'success');
    } catch (err) {
      addToast(err.message || 'Request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return <SentConfirmation email={email} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Reset password</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Enter your email and we will send you a link to reset your password.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
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

function SentConfirmation({ email }) {
  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Check your email</h1>
      <p className="text-muted-foreground text-sm mb-6">
        If an account exists for <strong className="text-foreground">{email}</strong>, we sent a
        password reset link. The link expires in about an hour.
      </p>
      <p className="text-muted-foreground text-sm mb-8">
        Did not receive it? Check spam or try again with the correct email.
      </p>
      <Link
        to="/forgot-password"
        className="inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        Try another email
      </Link>
      <p className="text-sm text-center mt-6">
        <Link to="/login" className="hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
