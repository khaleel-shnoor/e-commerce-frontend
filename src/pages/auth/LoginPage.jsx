import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Welcome back</h1>
      <p className="text-muted-foreground text-sm mb-8">Sign in to your account</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          login(form.get('email'), 'customer');
          addToast('Logged in successfully', 'success');
          navigate('/account');
        }}
      >
        <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
        <Input label="Password" name="password" type="password" required placeholder="••••••••" />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
      <p className="text-sm text-muted-foreground text-center mt-6">
        No account? <Link to="/register" className="text-foreground hover:underline">Create one</Link>
      </p>
      <div className="mt-6 pt-6 border-t border-border space-y-2">
        <Button variant="outline" className="w-full" onClick={() => { login('seller@test.com', 'seller'); navigate('/seller'); }}>
          Demo: Seller Login
        </Button>
        <Button variant="outline" className="w-full" onClick={() => { login('admin@test.com', 'admin'); navigate('/admin'); }}>
          Demo: Admin Login
        </Button>
      </div>
    </div>
  );
}
