import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <div className="rounded-2xl border border-mirror bg-white p-6 shadow-lg sm:p-8">
        <h1 className="font-display text-2xl font-semibold mb-1 text-center sm:text-3xl">Welcome Back</h1>
        <p className="text-center text-sm text-charcoal/50 mb-2">
          Are you a seller? <Link to="/admin/login" className="font-medium text-rust hover:underline">Login here</Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full rounded-lg border border-mirror px-3.5 py-2.5 text-sm focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-rust hover:underline">Forgot password?</Link>
            </div>
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
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="mt-2 rounded-xl bg-gradient-to-r from-indigo to-indigo/85 px-4 py-3 font-semibold text-ivory shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-charcoal/60">
          Don't have an account? <Link to="/register" className="font-medium text-rust hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
