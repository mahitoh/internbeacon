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
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: '#F6F5F1', fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #DEDCD2 1px, transparent 0)',
        backgroundSize: '26px 26px',
        opacity: .5,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 9, background: '#1E5B45' }}>
            <Compass size={17} className="text-white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: '#1B1D1A' }}>InternBeacon</span>
        </Link>

        <div style={{ background: '#fff', border: '1.5px solid #E7E6DF', borderRadius: 18, padding: '36px 32px', boxShadow: '0 4px 24px rgba(24,32,24,.05)' }}>
        {tokenError ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(192,86,62,0.08)', border: '1px solid rgba(192,86,62,0.2)' }}>
              <AlertCircle size={28} style={{ color: '#C0563E' }} />
            </div>
            <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#1B1D1A', letterSpacing: '-0.01em' }}>Invalid or expired link</h1>
            <p className="text-sm" style={{ color: '#6B6F69' }}>This reset link is no longer valid. Please request a new one.</p>
            <Link
              to="/forgot-password"
              className="inline-block mt-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-colors"
              style={{ background: '#1E5B45', color: '#fff' }}
            >
              Request new link
            </Link>
          </div>
        ) : done ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: '#EDF2EE', border: '1.5px solid #C4DBCE' }}>
              <CheckCircle2 size={28} style={{ color: '#1E5B45' }} />
            </div>
            <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#1B1D1A', letterSpacing: '-0.01em' }}>Password updated!</h1>
            <p className="text-sm" style={{ color: '#6B6F69' }}>Redirecting you to sign in…</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#1B1D1A', margin: '0 0 6px', letterSpacing: '-0.01em' }}>Set new password</h1>
            <p style={{ fontSize: 14, color: '#6B6F69', margin: 0 }}>Choose a strong password for your account.</p>

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
        </div>
      </motion.div>
    </div>
  );
}
