import { Link } from 'react-router-dom';

function Account() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-0">
      <h1 className="font-display text-2xl font-semibold mb-6">My Account</h1>
      {user ? (
        <div className="rounded border border-mirror bg-white p-6">
          <p className="text-lg font-medium">{user.fullName}</p>
          <p className="text-charcoal/60">{user.email}</p>
          <div className="mt-6 flex gap-4">
            <Link to="/account/orders" className="rounded bg-indigo px-4 py-2 text-sm font-medium text-ivory hover:bg-indigo/90">
              My Orders
            </Link>
            <Link to="/cart" className="rounded border border-mirror px-4 py-2 text-sm font-medium hover:bg-mirror/40">
              View Cart
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-charcoal/70">You are not logged in.</p>
      )}
    </div>
  );
}

export default Account;
