import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export default function ResetPasswordPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">New password</h1>
      <p className="text-muted-foreground text-sm mb-8">Create a strong new password</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          addToast('Password updated', 'success');
          navigate('/login');
        }}
      >
        <Input label="New Password" name="password" type="password" required />
        <Input label="Confirm Password" name="confirm" type="password" required />
        <Button type="submit" className="w-full">Update Password</Button>
      </form>
      <p className="text-sm text-center mt-6">
        <Link to="/login" className="hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
