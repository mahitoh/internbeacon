import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/auth';
import { LightInput } from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#F6F5F1', fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}
    >
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #DEDCD2 1px, transparent 0)',
        backgroundSize: '26px 26px',
        opacity: .5,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full"
        style={{ maxWidth: 412 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: 9, background: '#1E5B45' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polygon points="16 8 11 11 8 16 13 13 16 8" fill="#9FE870" stroke="#9FE870" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: '#1B1D1A' }}>InternBeacon</span>
        </Link>

        {sent ? (
          /* ── Success state ── */
          <div style={{ background: '#fff', border: '1.5px solid #E7E6DF', borderRadius: 18, padding: '36px 32px', textAlign: 'center', boxShadow: '0 4px 24px rgba(24,32,24,.05)' }}>
            <div className="flex items-center justify-center mx-auto mb-5"
              style={{ width: 64, height: 64, borderRadius: 18, background: '#EDF2EE', border: '1.5px solid #C4DBCE' }}>
              <CheckCircle2 size={28} style={{ color: '#1E5B45' }} />
            </div>
            <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#1B1D1A', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
              Check your inbox
            </h1>
            <p style={{ fontSize: 14, color: '#6B6F69', lineHeight: 1.6, margin: '0 0 24px' }}>
              If <strong style={{ color: '#1B1D1A' }}>{email}</strong> is registered, we've sent a reset link. Check your spam folder if it doesn't arrive within a minute.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1.5"
              style={{ fontSize: 14, fontWeight: 600, color: '#1E5B45', textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <div style={{ background: '#fff', border: '1.5px solid #E7E6DF', borderRadius: 18, padding: '36px 32px', boxShadow: '0 4px 24px rgba(24,32,24,.05)' }}>
            <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#1B1D1A', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              Forgot your password?
            </h1>
            <p style={{ fontSize: 14, color: '#6B6F69', margin: '0 0 28px', lineHeight: 1.5 }}>
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <LightInput
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="you@university.cm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center"
                style={{
                  background: loading ? '#4E8A6E' : '#1E5B45',
                  color: '#fff', border: 'none', borderRadius: 11,
                  padding: '14px', fontSize: 15, fontWeight: 600,
                  fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 2px rgba(30,91,69,.3)',
                }}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1.5"
            style={{ fontSize: 13.5, color: '#6B6F69', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
