import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Create account</h1>
      <p className="text-muted-foreground text-sm mb-8">Join SHNOOR today</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          login('new@example.com', 'customer');
          addToast('Account created', 'success');
          navigate('/account');
        }}
      >
        <Input label="Full Name" name="name" required placeholder="Alex Morgan" />
        <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
        <Input label="Password" name="password" type="password" required placeholder="••••••••" />
        <Button type="submit" className="w-full">Create Account</Button>
      </form>
      <p className="text-sm text-muted-foreground text-center mt-6">
        Have an account? <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

