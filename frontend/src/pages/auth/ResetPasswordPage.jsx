import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../api/auth';
import Button from '../../components/ui/Button';
import { DarkInput } from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [tokenError,  setTokenError]  = useState(false);
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const [done,        setDone]        = useState(false);

  // Supabase puts the access_token in the URL hash after redirect
  useEffect(() => {
    const hash   = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token  = params.get('access_token');
    const type   = params.get('type');

    if (token && type === 'recovery') {
      setAccessToken(token);
      // Clean the hash from the URL without a reload
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      setTokenError(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(accessToken, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed — the link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
            <Compass size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">InternBeacon</span>
        </Link>

        {tokenError ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Invalid or expired link</h1>
            <p className="text-white/50 text-sm">This reset link is no longer valid. Please request a new one.</p>
            <Link
              to="/forgot-password"
              className="inline-block mt-2 px-6 py-2.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Request new link
            </Link>
          </div>
        ) : done ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-lime-500/15 border border-lime-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-lime-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Password updated!</h1>
            <p className="text-white/50 text-sm">Redirecting you to sign in…</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-black text-white">Set new password</h1>
            <p className="text-white/40 mt-2 text-sm">Choose a strong password for your account.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <DarkInput
                label="New password"
                type="password"
                icon={Lock}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <DarkInput
                label="Confirm password"
                type="password"
                icon={Lock}
                placeholder="Repeat your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!accessToken}
                className="w-full"
              >
                Update Password
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
