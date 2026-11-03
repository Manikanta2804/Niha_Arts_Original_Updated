import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', passkey: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/admin-login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded border border-charcoal/50 bg-[#1f1c1a] p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-mirror/70 text-center">Seller / Admin</p>
        <h1 className="font-display text-2xl font-semibold text-ivory text-center mt-1 mb-6">
          NiHarts Dashboard
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-ivory/80">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded border border-ivory/20 bg-transparent px-3 py-2 text-ivory focus:border-rust focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ivory/80">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded border border-ivory/20 bg-transparent px-3 py-2 text-ivory focus:border-rust focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ivory/80">Admin Passkey</label>
            <input
              type="password"
              name="passkey"
              value={formData.passkey}
              onChange={handleChange}
              required
              placeholder="Secret passkey"
              className="w-full rounded border border-ivory/20 bg-transparent px-3 py-2 text-ivory placeholder:text-ivory/30 focus:border-rust focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded bg-rust px-4 py-2.5 font-medium text-ivory hover:bg-rust/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in to Dashboard'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-ivory/50">
          Not a seller? <Link to="/login" className="text-rust underline">Customer login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
