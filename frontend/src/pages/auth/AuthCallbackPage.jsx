import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AuthCallbackPage() {
  const navigate     = useNavigate();
  const { refetchUser } = useAuth();

  useEffect(() => {
    let handled = false;

    async function processSession(session) {
      if (handled) return;
      handled = true;

      localStorage.setItem('accessToken',  session.access_token);
      localStorage.setItem('refreshToken', session.refresh_token);

      try {
        const r = await authApi.me();
        const u = r.data.data;

        const needsOnboarding =
          !u.role ||
          u.role === 'authenticated' ||
          (!u.studentProfile && !u.companyProfile);

        if (needsOnboarding) {
          navigate('/onboarding', { replace: true });
        } else {
          await refetchUser();
          toast.success('Welcome back!');
          navigate(
            u.role === 'student' ? '/student/dashboard' :
            u.role === 'company' ? '/company/dashboard' :
            u.role === 'admin'   ? '/admin/dashboard'   : '/',
            { replace: true }
          );
        }
      } catch {
        // /me failed (profile row might not exist yet)
        navigate('/onboarding', { replace: true });
      }
    }

    // Check if Supabase already parsed the session from the URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) processSession(session);
    });

    // Also listen for the auth state change (fires when PKCE code is exchanged)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) processSession(session);
    });

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (!handled) {
        toast.error('Sign-in timed out. Please try again.');
        navigate('/login', { replace: true });
      }
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner />
        <p className="text-white/40 text-sm">Signing you in with Google…</p>
      </div>
    </div>
  );
}
