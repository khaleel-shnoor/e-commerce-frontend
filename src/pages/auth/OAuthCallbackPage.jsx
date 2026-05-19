import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

function dashboardPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'seller') return '/seller';
  return '/account';
}

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const { loginWithTokens } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const access = params.get('access_token');
    const refresh = params.get('refresh_token');
    if (!access || !refresh) {
      addToast('OAuth sign-in failed', 'error');
      navigate('/login', { replace: true });
      return;
    }

    loginWithTokens({ access_token: access, refresh_token: refresh })
      .then((user) => {
        addToast('Signed in with Google', 'success');
        navigate(dashboardPath(user.role), { replace: true });
      })
      .catch(() => {
        addToast('OAuth sign-in failed', 'error');
        navigate('/login', { replace: true });
      });
  }, [params, loginWithTokens, addToast, navigate]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      Completing sign-in…
    </div>
  );
}
