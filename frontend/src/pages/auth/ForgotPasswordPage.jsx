import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Compass, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/auth';
import Button from '../../components/ui/Button';
import { DarkInput } from '../../components/ui/Input';
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

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-lime-500/15 border border-lime-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-lime-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Check your inbox</h1>
            <p className="text-white/50 text-sm leading-relaxed">
              If <span className="text-white/70">{email}</span> is registered, we've sent a password reset link. Check your spam folder if it doesn't arrive within a minute.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-lime-400 hover:text-lime-300 transition-colors mt-4"
            >
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-black text-white">Forgot password?</h1>
            <p className="text-white/40 mt-2 text-sm">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <DarkInput
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
