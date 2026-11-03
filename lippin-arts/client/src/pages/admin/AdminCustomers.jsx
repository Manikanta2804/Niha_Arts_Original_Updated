import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchCustomers = () => {
    api.get('/users').then((res) => setCustomers(res.data));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleBlock = async (id, blocked) => {
    await api.put(`/users/${id}/block`, { blocked: !blocked });
    fetchCustomers();
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Delete this customer permanently?')) return;
    await api.delete(`/users/${id}`);
    fetchCustomers();
  };

  const filtered = customers.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Customers</h1>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/40"
      />
      <div className="overflow-x-auto rounded border border-ivory/10">
        <table className="w-full text-sm">
          <thead className="bg-ivory/5 text-left text-ivory/60">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id} className="border-t border-ivory/10">
                <td className="p-3">{c.fullName}</td>
                <td className="p-3 text-ivory/70">{c.email}</td>
                <td className="p-3 text-ivory/70">{c.phone}</td>
                <td className="p-3 text-ivory/50 text-xs">
                  {new Date(c.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="p-3">
                  <span className={`rounded px-2 py-1 text-xs ${c.blocked ? 'bg-red-500/20 text-red-400' : 'bg-sage/20 text-sage'}`}>
                    {c.blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-3 space-x-3">
                  <button onClick={() => toggleBlock(c._id, c.blocked)} className="text-indigo hover:underline">
                    {c.blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button onClick={() => deleteCustomer(c._id)} className="text-red-400 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCustomers;
