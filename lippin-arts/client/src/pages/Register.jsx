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
  { label: 'One special character (!@#$%^&*)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordValid = passwordRules.every((rule) => rule.test(formData.password));
  const emailValid = emailRegex.test(formData.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailValid) {
      setError('Please enter a valid email address');
      return;
    }
    if (!passwordValid) {
      setError('Password does not meet all requirements');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <div className="rounded-2xl border border-mirror bg-white p-6 shadow-lg sm:p-8">
        <h1 className="font-display text-2xl font-semibold mb-1 text-center sm:text-3xl">Create Account</h1>
        <p className="text-center text-sm text-charcoal/50 mb-6">Join NiHarts and start shopping handmade</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Name</label>
            <input
              type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
              className="w-full rounded-lg border border-mirror px-3.5 py-2.5 text-sm focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange} required
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                formData.email && !emailValid ? 'border-red-400 focus:ring-red-100' : 'border-mirror focus:border-indigo focus:ring-indigo/10'
              }`}
            />
            {formData.email && !emailValid && (
              <p className="mt-1 text-xs text-red-500">Enter a valid email address (e.g. name@example.com)</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
            <input
              type="text" name="phone" value={formData.phone} onChange={handleChange} required
              className="w-full rounded-lg border border-mirror px-3.5 py-2.5 text-sm focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                className="w-full rounded-lg border border-mirror px-3.5 py-2.5 pr-11 text-sm focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-indigo transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                {passwordRules.map((rule) => {
                  const passed = rule.test(formData.password);
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

          <div>
            <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                className="w-full rounded-lg border border-mirror px-3.5 py-2.5 pr-11 text-sm focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-indigo transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="mt-2 rounded-xl bg-gradient-to-r from-rust to-rust/85 px-4 py-3 font-semibold text-ivory shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-charcoal/60">
          Already have an account? <Link to="/login" className="font-medium text-rust hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
