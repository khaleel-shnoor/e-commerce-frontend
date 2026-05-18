import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordPage() {
  const { addToast } = useToast();

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Reset password</h1>
      <p className="text-muted-foreground text-sm mb-8">Enter your email to receive a reset link</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          addToast('Reset link sent to your email', 'success');
        }}
      >
        <Input label="Email" name="email" type="email" required />
        <Button type="submit" className="w-full">Send Reset Link</Button>
      </form>
      <p className="text-sm text-center mt-6">
        <Link to="/login" className="hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
