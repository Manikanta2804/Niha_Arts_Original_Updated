import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const fetchOrders = () => {
    api.get('/orders').then((res) => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
    if (selectedOrder?._id === id) {
      setSelectedOrder((prev) => ({ ...prev, status }));
    }
  };

  const viewCustomer = async (order) => {
    setSelectedOrder(order);
    try {
      const res = await api.get('/users');
      const match = res.data.find((u) => u._id === order.user?._id);
      setCustomerInfo(match || null);
    } catch {
      setCustomerInfo(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const searchLower = search.trim().toLowerCase();
      const matchesSearch =
        !searchLower ||
        o._id.toLowerCase().includes(searchLower) ||
        o.user?.fullName?.toLowerCase().includes(searchLower) ||
        o.user?.email?.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

      const orderDate = new Date(o.createdAt);
      const matchesFrom = !dateFrom || orderDate >= new Date(dateFrom);
      const matchesTo = !dateTo || orderDate <= new Date(dateTo + 'T23:59:59');

      const matchesMin = !minAmount || o.total >= Number(minAmount);
      const matchesMax = !maxAmount || o.total <= Number(maxAmount);

      return matchesSearch && matchesStatus && matchesFrom && matchesTo && matchesMin && matchesMax;
    });
  }, [orders, search, statusFilter, dateFrom, dateTo, minAmount, maxAmount]);

  const clearFilters = () => {
    setSearch(''); setStatusFilter('All'); setDateFrom(''); setDateTo(''); setMinAmount(''); setMaxAmount('');
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Orders</h1>

      <div className="mb-6 rounded-lg border border-ivory/10 bg-ivory/5 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs text-ivory/60">Search (Order ID, customer name, or email)</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. #a1b2c3d4 or Jane Doe"
              className="w-full rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-ivory/60">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded border border-ivory/20 bg-[#1f1c1a] px-3 py-2 text-sm">
              <option value="All">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-ivory/60">Date from</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded border border-ivory/20 bg-[#1f1c1a] px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-ivory/60">Date to</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded border border-ivory/20 bg-[#1f1c1a] px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-ivory/60">Min amount (₹)</label>
            <input type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="0"
              className="w-full rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/30" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-ivory/60">Max amount (₹)</label>
            <input type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="No limit"
              className="w-full rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/30" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-ivory/50">{filteredOrders.length} of {orders.length} orders</p>
          <button onClick={clearFilters} className="text-xs text-rust hover:underline">Clear all filters</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-ivory/10">
        <table className="w-full text-sm">
          <thead className="bg-ivory/5 text-left text-ivory/60">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-ivory/40">No orders match your filters</td></tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o._id} className="border-t border-ivory/10">
                  <td className="p-3 font-mono text-xs">#{o._id.slice(-8)}</td>
                  <td className="p-3 text-ivory/70 text-xs whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  <td className="p-3">{o.user?.fullName}</td>
                  <td className="p-3">₹{o.total.toFixed(0)}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="rounded border border-ivory/20 bg-[#1f1c1a] px-2 py-1 text-xs"
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 space-x-3">
                    <button onClick={() => viewCustomer(o)} className="text-indigo hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded border border-ivory/10 bg-[#1f1c1a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Order #{selectedOrder._id.slice(-8)}</h2>
              <button onClick={() => { setSelectedOrder(null); setCustomerInfo(null); }} className="text-ivory/50 hover:text-ivory">✕</button>
            </div>

            <p className="text-sm text-ivory/60 mb-4">Placed: {formatDate(selectedOrder.createdAt)}</p>

            <h3 className="text-sm font-medium mb-1">Customer</h3>
            {customerInfo ? (
              <dl className="text-sm text-ivory/70 mb-4 space-y-1">
                <div className="flex justify-between"><dt>Name</dt><dd>{customerInfo.fullName}</dd></div>
                <div className="flex justify-between"><dt>Email</dt><dd>{customerInfo.email}</dd></div>
                <div className="flex justify-between"><dt>Phone</dt><dd>{customerInfo.phone}</dd></div>
                <div className="flex justify-between"><dt>Joined</dt><dd>{new Date(customerInfo.createdAt).toLocaleDateString('en-IN')}</dd></div>
              </dl>
            ) : (
              <p className="text-sm text-ivory/50 mb-4">Loading customer info...</p>
            )}

            <h3 className="text-sm font-medium mb-2">Items</h3>
            <div className="divide-y divide-ivory/10 rounded border border-ivory/10 mb-4">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between p-2 text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
            <p className="text-sm text-ivory/70 mb-4">
              {selectedOrder.shippingAddress.fullName}, {selectedOrder.shippingAddress.phone}<br />
              {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.city},{' '}
              {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
            </p>

            <p className="text-sm text-ivory/70 mb-4">Payment: {selectedOrder.paymentApp}</p>

            <div className="flex items-center justify-between">
              <p className="font-display font-semibold">Total: ₹{selectedOrder.total.toFixed(0)}</p>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                className="rounded border border-ivory/20 bg-[#1f1c1a] px-2 py-1 text-sm"
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
