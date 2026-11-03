import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import { API_URL } from '../services/api';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/products`).then((res) => {
      setProducts(res.data);
      const uniqueCategories = Array.from(
        new Map(res.data.map((p) => [p.category?._id, p.category])).values()
      ).filter(Boolean);
      setCategories(uniqueCategories);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      await api.post('/cart', { productId, quantity: 1 });
      setMessage('Added to cart');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Could not add to cart');
    }
  };

  const filtered = selectedCategory ? products.filter((p) => p.category?._id === selectedCategory) : products;

  if (loading) return <p className="p-8">Loading products...</p>;

  return (
    <div className="flex flex-col gap-8 px-4 py-10 sm:flex-row sm:px-8">
      <aside className="shrink-0 sm:w-56">
        <h2 className="font-display text-lg font-semibold mb-4 pb-2 border-b-2 border-rust/30">Categories</h2>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${!selectedCategory ? 'bg-indigo text-ivory shadow-sm' : 'hover:bg-mirror/40'}`}
          >
            All products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedCategory === cat._id ? 'bg-indigo text-ivory shadow-sm' : 'hover:bg-mirror/40'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1">
        <h1 className="font-display text-3xl font-semibold mb-1">Shop</h1>
        <p className="text-sm text-charcoal/60 mb-7">{filtered.length} handcrafted items</p>
        {message && <p className="mb-4 rounded-lg bg-sage/15 px-4 py-2 text-sm font-medium text-sage">{message}</p>}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => {
            const discountedPrice = product.price - (product.price * product.discount) / 100;
            return (
              <div key={product._id} className="group flex flex-col overflow-hidden rounded-xl border border-mirror bg-white shadow-sm hover:shadow-lg transition-shadow">
                <Link to={`/products/${product._id}`} className="relative block">
                  <div className="aspect-square overflow-hidden bg-ivory">
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 rounded-full bg-rust px-2.5 py-1 text-xs font-semibold text-ivory shadow">
                      {product.discount}% OFF
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-sm font-medium line-clamp-2 hover:text-rust transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-charcoal/50 mt-0.5">{product.category?.name}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    {product.discount > 0 && <span className="text-xs text-charcoal/40 line-through">₹{product.price}</span>}
                    <span className="font-display text-lg font-semibold text-rust">₹{discountedPrice.toFixed(0)}</span>
                  </div>
                  <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${product.stock > 0 ? 'text-sage' : 'text-red-500'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-sage' : 'bg-red-500'}`} />
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    className="mt-3 rounded-lg bg-indigo px-3 py-2.5 text-sm font-medium text-ivory hover:bg-indigo/90 disabled:opacity-40 shadow-sm hover:shadow transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Products;
