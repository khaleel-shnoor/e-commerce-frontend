import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getGoogleLoginUrl } from '../../lib/api';

function dashboardPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'seller') return '/seller';
  return '/account';
}

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      const user = await login(form.get('email'), form.get('password'));
      addToast('Logged in successfully', 'success');
      navigate(from || dashboardPath(user.role), { replace: true });
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Welcome back</h1>
      <p className="text-muted-foreground text-sm mb-8">Sign in to your account</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
        <Input label="Password" name="password" type="password" required placeholder="••••••••" />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
      <p className="text-sm text-muted-foreground text-center mt-6">
        No account?{' '}
        <Link to="/register" className="text-foreground hover:underline">
          Create one
        </Link>
      </p>
      <div className="mt-6 pt-6 border-t border-border space-y-2">
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
