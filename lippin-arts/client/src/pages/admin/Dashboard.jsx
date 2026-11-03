import { useState, useEffect } from 'react';
import api from '../../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts },
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Customers', value: stats.totalCustomers },
    { label: 'Pending Orders', value: stats.pendingOrders },
    { label: "Today's Sales", value: `₹${stats.todaysSales.toFixed(0)}` },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(0)}` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded border border-ivory/10 bg-ivory/5 p-4">
            <p className="text-xs uppercase tracking-wide text-ivory/50">{c.label}</p>
            <p className="font-display text-2xl font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
