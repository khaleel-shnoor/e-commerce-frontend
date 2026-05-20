import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

function verificationMessage(user) {
  const seller = user?.seller;
  if (!user?.is_verified) {
    return {
      title: 'Verify your email',
      body: 'Check your inbox for the verification link. Seller features stay disabled until your email is verified.',
    };
  }
  if (seller?.status === 'rejected') {
    return {
      title: 'Seller account not approved',
      body: 'Your seller application was rejected. Contact support if you believe this is a mistake.',
    };
  }
  if (seller?.status === 'suspended') {
    return {
      title: 'Seller account suspended',
      body: 'Your seller account is suspended. Contact support for assistance.',
    };
  }
  return {
    title: 'Account pending approval',
    body: 'Your email is verified. An admin must approve your seller account before you can manage products and orders.',
  };
}

export function SellerVerificationGate({ children }) {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [resending, setResending] = useState(false);

  const seller = user?.seller;
  const isFullyEnabled =
    user?.is_verified && seller?.status === 'approved';

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerification(user.email);
      addToast('Verification email sent', 'success');
    } catch (err) {
      addToast(err.message || 'Could not resend email', 'error');
    } finally {
      setResending(false);
    }
  };

  const { title, body } = verificationMessage(user);

  return (
    <div className="relative">
      <div
        className={isFullyEnabled ? '' : 'pointer-events-none select-none opacity-50'}
        aria-hidden={!isFullyEnabled}
      >
        {children}
      </div>

      {!isFullyEnabled && (
        <Modal open dismissible={false} title={title} className="max-w-md">
          <p className="text-sm text-muted-foreground mb-6">{body}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {!user?.is_verified && (
              <Button variant="outline" onClick={handleResend} disabled={resending}>
                {resending ? 'Sending…' : 'Resend verification email'}
              </Button>
            )}
            <Button variant="outline" onClick={() => refreshUser()}>
              Refresh status
            </Button>
            <Link
              to="/seller/profile"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm text-primary-foreground hover:opacity-90"
            >
              View profile
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
}
