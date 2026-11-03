import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const fetchCategories = () => {
    api.get('/categories').then((res) => setCategories(res.data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name });
      setName('');
      setMessage('Category added');
      fetchCategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not add category');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Categories</h1>

      <form onSubmit={handleAdd} className="mb-6 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          required
          className="flex-1 max-w-xs rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/40"
        />
        <button type="submit" className="rounded bg-rust px-4 py-2 text-sm font-medium text-ivory hover:bg-rust/90">
          Add Category
        </button>
      </form>

      {message && <p className="mb-4 text-sm text-sage">{message}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((c) => (
          <div key={c._id} className="rounded border border-ivory/10 bg-ivory/5 p-3 text-sm">
            {c.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategories;
