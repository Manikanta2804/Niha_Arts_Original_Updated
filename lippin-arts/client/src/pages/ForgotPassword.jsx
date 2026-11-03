import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../services/api';

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordValid = passwordRules.every((rule) => rule.test(newPassword));

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage('A 6-digit code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!passwordValid) {
      setError('Password does not meet all requirements');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, { email, otp, newPassword });
      alert('Password reset successfully! Please log in with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password');
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <div className="rounded-2xl border border-mirror bg-white p-6 shadow-lg sm:p-8">
        <h1 className="font-display text-2xl font-semibold mb-1 text-center sm:text-3xl">Reset Password</h1>
        <p className="text-center text-sm text-charcoal/50 mb-6">
          {step === 1 && "Enter your registered email to receive a reset code"}
          {step === 2 && "Enter the 6-digit code sent to your email"}
          {step === 3 && "Choose a new password"}
        </p>

        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1.5 w-10 rounded-full ${n <= step ? 'bg-rust' : 'bg-mirror'}`} />
          ))}
        </div>

        {message && <p className="mb-4 rounded-lg bg-sage/15 px-4 py-2.5 text-sm text-sage">{message}</p>}
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-lg border border-mirror px-3.5 py-2.5 text-sm focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
              />
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 rounded-xl bg-gradient-to-r from-rust to-rust/85 px-4 py-3 font-semibold text-ivory shadow-md hover:shadow-lg disabled:opacity-50 transition-all">
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">6-Digit Code</label>
              <input
                type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6}
                placeholder="000000"
                className="w-full rounded-lg border border-mirror px-3.5 py-2.5 text-center text-lg tracking-[0.3em] focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
              />
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 rounded-xl bg-gradient-to-r from-rust to-rust/85 px-4 py-3 font-semibold text-ivory shadow-md hover:shadow-lg disabled:opacity-50 transition-all">
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                  className="w-full rounded-lg border border-mirror px-3.5 py-2.5 pr-11 text-sm focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-indigo transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {newPassword && (
                <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(newPassword);
                    return (
                      <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${passed ? 'text-sage' : 'text-charcoal/40'}`}>
                        <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] ${passed ? 'bg-sage text-ivory' : 'bg-mirror'}`}>
                          {passed ? '✓' : ''}
                        </span>
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 rounded-xl bg-gradient-to-r from-rust to-rust/85 px-4 py-3 font-semibold text-ivory shadow-md hover:shadow-lg disabled:opacity-50 transition-all">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-charcoal/60">
          Remembered your password? <Link to="/login" className="font-medium text-rust hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
