import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const statusColors = {
  Pending: 'bg-mirror/40 text-charcoal',
  Processing: 'bg-indigo/20 text-indigo',
  Shipped: 'bg-sage/20 text-sage',
  Delivered: 'bg-sage/30 text-sage',
  Cancelled: 'bg-red-100 text-red-600',
};

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-8">Loading orders...</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <h1 className="font-display text-2xl font-semibold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-charcoal/70">
          No orders yet. <Link to="/products" className="text-rust underline">Start shopping</Link>
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded border border-mirror bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-charcoal/50">#{order._id.slice(-8)}</p>
                  <p className="text-sm text-charcoal/60">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`rounded px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-3 divide-y divide-mirror">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-right font-display font-semibold">Total: ₹{order.total.toFixed(0)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
