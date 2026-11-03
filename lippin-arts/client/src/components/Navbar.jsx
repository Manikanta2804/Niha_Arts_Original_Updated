import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="sticky top-0 z-30 bg-ivory/95 backdrop-blur-sm">
      <nav className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/niharts-logo.jpeg" alt="NiHarts" className="h-11 w-11 rounded-full object-cover" />
          <span className="font-display text-2xl font-semibold tracking-tight text-indigo">NiHarts</span>
        </Link>
        <div className="flex flex-wrap items-center gap-5 text-sm font-medium sm:gap-8 sm:text-base">
          <Link to="/products" className="relative text-charcoal/80 hover:text-rust transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-rust after:transition-all hover:after:w-full">
            Shop
          </Link>
          {user ? (
            <>
              <Link to="/cart" className="relative text-charcoal/80 hover:text-rust transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-rust after:transition-all hover:after:w-full">
                Cart
              </Link>
              <Link to="/account" className="relative text-charcoal/80 hover:text-rust transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-rust after:transition-all hover:after:w-full">
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-indigo/30 px-4 py-1.5 text-indigo hover:bg-indigo hover:text-ivory transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-charcoal/80 hover:text-rust transition-colors">Login</Link>
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-rust to-rust/80 px-5 py-2 font-medium text-ivory shadow-sm hover:shadow-md hover:from-rust/90 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="motif-divider" />
    </div>
  );
}

export default Navbar;
