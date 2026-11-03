import { useParams, Link } from 'react-router-dom';

function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-0">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage/20 text-3xl text-sage">
        ✓
      </div>
      <h1 className="font-display text-2xl font-semibold">Order placed!</h1>
      <p className="mt-2 text-charcoal/70">
        Your order <span className="font-mono text-sm">#{id.slice(-8)}</span> has been placed successfully.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/account/orders" className="rounded bg-indigo px-4 py-2 text-sm font-medium text-ivory hover:bg-indigo/90">
          View my orders
        </Link>
        <Link to="/products" className="rounded border border-mirror px-4 py-2 text-sm font-medium hover:bg-mirror/40">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
