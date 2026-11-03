import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState({
    fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '',
  });
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.get('/cart').then((res) => setCart(res.data)).catch(() => navigate('/cart'));
  }, []);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not supported on this browser');
      return;
    }
    setLocating(true);
    setLocated(false);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const a = data.address || {};
          setAddress((prev) => ({
            ...prev,
            addressLine: [a.road, a.suburb, a.neighbourhood].filter(Boolean).join(', ') || data.display_name,
            city: a.city || a.town || a.village || '',
            state: a.state || '',
            pincode: a.postcode || '',
          }));
          setLocated(true);
        } catch {
          setLocationError('Could not fetch address for this location');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocationError('Could not get your location. Please allow location access or enter address manually.');
        setLocating(false);
      }
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError('');

    try {
      const orderRes = await api.post('/payment/create-order', { amount: total });
      const razorpayOrder = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'Lippin Arts',
        description: 'Order Payment',
        order_id: razorpayOrder.order_id,
        config: {
          display: {
            blocks: {
              upi: { name: 'Pay via UPI', instruments: [{ method: 'upi' }] },
              other: { name: 'Other methods', instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }] },
            },
            sequence: ['block.upi', 'block.other'],
            preferences: { show_default_blocks: false },
          },
        },
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (!verifyRes.data.success) {
              setError('Payment could not be verified. Please contact support.');
              setPlacing(false);
              return;
            }
            const res = await api.post('/orders', {
              shippingAddress: address,
              paymentApp: 'Razorpay',
              razorpayPaymentId: response.razorpay_payment_id,
            });
            navigate(`/order-success/${res.data._id}`);
          } catch (err) {
            setError('Payment succeeded but order could not be saved. Contact support.');
            setPlacing(false);
          }
        },
        prefill: { name: address.fullName || user?.fullName, contact: address.phone, email: user?.email },
        theme: { color: '#6B1E23' },
        modal: { ondismiss: function () { setPlacing(false); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start payment');
      setPlacing(false);
    }
  };

  if (!cart) return <p className="p-8">Loading...</p>;

  const items = cart.items || [];
  const total = items.reduce((sum, item) => {
    const price = item.product.price - (item.product.price * item.product.discount) / 100;
    return sum + price * item.quantity;
  }, 0);

  const fields = [
    { label: 'Full Name', name: 'fullName' },
    { label: 'Phone Number', name: 'phone' },
    { label: 'Address', name: 'addressLine' },
    { label: 'City', name: 'city' },
    { label: 'State', name: 'state' },
    { label: 'Pincode', name: 'pincode' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <h1 className="font-display text-3xl font-semibold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-5">
          <h2 className="font-display text-xl font-semibold">Shipping Address</h2>

          {/* Premium location detector card */}
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border-2 p-4 text-left transition-all ${
              located ? 'border-sage bg-sage/10' : 'border-mirror bg-white hover:border-rust/40 hover:shadow-md'
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${
                located ? 'bg-sage text-ivory' : 'bg-gradient-to-br from-rust to-rust/70 text-ivory'
              } ${locating ? 'locating-pulse' : ''}`}
            >
              {located ? '✓' : locating ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ivory border-t-transparent" />
              ) : '📍'}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {located ? 'Location detected!' : locating ? 'Detecting your location...' : 'Use my current location'}
              </p>
              <p className="text-xs text-charcoal/50">
                {located ? 'Address auto-filled below — feel free to edit' : 'We\'ll auto-fill your address using GPS'}
              </p>
            </div>
            {!located && !locating && (
              <span className="text-rust opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            )}
          </button>
          {locationError && <p className="text-sm text-red-500">{locationError}</p>}

          {fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
              <input
                type="text"
                name={f.name}
                value={address[f.name]}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-mirror px-3.5 py-2.5 focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 transition-all"
              />
            </div>
          ))}

          {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="mt-3 rounded-xl bg-gradient-to-r from-rust to-rust/85 px-6 py-3.5 font-semibold text-ivory shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {placing ? 'Opening payment...' : `Pay ₹${total.toFixed(0)} with Razorpay`}
          </button>
        </form>

        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
          <div className="divide-y divide-mirror rounded-xl border border-mirror bg-white shadow-sm">
            {items.map((item) => {
              const price = item.product.price - (item.product.price * item.product.discount) / 100;
              return (
                <div key={item.product._id} className="flex items-center gap-3 p-4">
                  <img src={item.product.images[0]} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-charcoal/50">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(price * item.quantity).toFixed(0)}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-indigo/5 px-5 py-4">
            <span className="font-medium text-charcoal/70">Total</span>
            <p className="font-display text-2xl font-bold text-indigo">₹{total.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
