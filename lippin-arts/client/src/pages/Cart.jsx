import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCart = () => {
    api
      .get('/cart')
      .then((res) => setCart(res.data))
      .catch(() => setError('Could not load cart. Are you logged in?'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await api.put('/cart', { productId, quantity });
    fetchCart();
  };

  const removeItem = async (productId) => {
    await api.delete(`/cart/${productId}`);
    fetchCart();
  };

  if (loading) return <p className="p-8">Loading cart...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => {
    const price = item.product.price - (item.product.price * item.product.discount) / 100;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-charcoal/70">
          Your cart is empty.{' '}
          <Link to="/products" className="text-rust underline">Go shopping</Link>
        </p>
      ) : (
        <>
          <div className="divide-y divide-mirror rounded border border-mirror bg-white">
            {items.map((item) => {
              const price = item.product.price - (item.product.price * item.product.discount) / 100;
              return (
                <div key={item.product._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-20 w-20 shrink-0 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-charcoal/60">₹{price.toFixed(0)} each</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="h-7 w-7 rounded border border-mirror hover:bg-mirror/40"
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="h-7 w-7 rounded border border-mirror hover:bg-mirror/40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-2">
                    <p className="font-display font-semibold text-rust">₹{(price * item.quantity).toFixed(0)}</p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="font-display text-xl font-semibold">Total: ₹{total.toFixed(0)}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="rounded bg-rust px-6 py-3 font-medium text-ivory hover:bg-rust/90 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
