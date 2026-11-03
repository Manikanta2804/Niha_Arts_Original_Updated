import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user?.isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/orders', label: 'Orders' },
  ];

  return (
    <div className="min-h-screen bg-[#1f1c1a] text-ivory">
      <div className="flex items-center justify-between border-b border-ivory/10 px-4 py-4 sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-mirror/70">NiHarts</p>
          <p className="font-display text-lg font-semibold">Seller Dashboard</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-ivory/70 hover:text-rust">
          Logout
        </button>
      </div>
      <div className="flex flex-col sm:flex-row">
        <nav className="flex shrink-0 gap-2 border-b border-ivory/10 p-4 sm:w-48 sm:flex-col sm:border-b-0 sm:border-r sm:p-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded px-3 py-2 text-sm ${
                location.pathname === link.to ? 'bg-rust text-ivory' : 'text-ivory/70 hover:bg-ivory/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 p-4 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
