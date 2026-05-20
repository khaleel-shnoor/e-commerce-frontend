import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getGoogleLoginUrl } from '../../lib/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    try {
      await register({
        email: form.get('email'),
        password: form.get('password'),
        full_name: form.get('name'),
        role: role === 'seller' ? 'seller' : 'customer',
        store_name: role === 'seller' ? form.get('store_name') : null,
        description: role === 'seller' ? form.get('description') : null,
      });

      addToast('Account created — check your email to verify', 'success');

      navigate(role === 'seller' ? '/seller' : '/account');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Create account</h1>

      <p className="text-muted-foreground text-sm mb-8">
        Join SHNOOR today
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Account Type</label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`rounded-xl border px-4 py-3 text-sm transition ${
                role === 'customer'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background'
              }`}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`rounded-xl border px-4 py-3 text-sm transition ${
                role === 'seller'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background'
              }`}
            >
              Seller
            </button>
          </div>
        </div>

        <Input
          label="Full Name"
          name="name"
          required
          placeholder="Alex Morgan"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
        />

        {role === 'seller' && (
          <>
            <Input
              label="Store Name"
              name="store_name"
              required
              placeholder="SHNOOR Store"
            />


            <Textarea
              label="Store Description"
              name="description"
              placeholder="Tell customers about your store"
            />
          </>
        )}

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Have an account?{' '}
        <Link
          to="/login"
          className="text-foreground hover:underline"
        >
          Sign in
        </Link>
      </p>

      <div className="mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() => {
            window.location.href = getGoogleLoginUrl();
          }}
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}