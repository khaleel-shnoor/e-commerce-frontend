import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function OtpPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-heading tracking-wide mb-2">Verify OTP</h1>
      <p className="text-muted-foreground text-sm mb-8">Enter the 6-digit code sent to your email</p>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/reset-password'); }}>
        <Input label="OTP Code" name="otp" placeholder="000000" maxLength={6} required />
        <Button type="submit" className="w-full">Verify</Button>
      </form>
      <p className="text-sm text-center mt-6 text-muted-foreground">
        Did not receive code? <button type="button" className="text-foreground hover:underline">Resend</button>
      </p>
      <p className="text-sm text-center mt-2">
        <Link to="/login" className="hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
