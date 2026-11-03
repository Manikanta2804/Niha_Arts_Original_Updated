import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../services/api';
import { API_URL } from '../../services/api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', materials: '',
    price: '', discount: 0, stock: '', featured: false, trending: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProducts = () => {
    axios.get(`${API_URL}/api/products`).then((res) => setProducts(res.data));
  };

  const fetchCategories = () => {
    axios.get(`${API_URL}/api/categories`).then((res) => setCategories(res.data));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('image', file);
    const res = await axios.post(`${API_URL}/api/upload`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url.startsWith('http') ? res.data.url : `${API_URL}${res.data.url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage('Please upload a product photo');
      return;
    }
    setUploading(true);
    try {
      const imageUrl = await uploadImage(imageFile);
      await api.post('/products', {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        materials: formData.materials,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        images: [imageUrl],
        featured: formData.featured,
        trending: formData.trending,
      });
      setMessage('Product added');
      setShowForm(false);
      setFormData({
        name: '', category: '', description: '', materials: '',
        price: '', discount: 0, stock: '', featured: false, trending: false,
      });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch {
      setMessage('Could not add product');
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setEditImageFile(null);
    setEditValues({
      name: product.name,
      category: product.category?._id || '',
      description: product.description,
      materials: product.materials || '',
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      currentImage: product.images?.[0] || '',
      featured: product.featured,
      trending: product.trending,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditValues({ ...editValues, [name]: type === 'checkbox' ? checked : value });
  };

  const saveEdit = async () => {
    try {
      let imageUrl = editValues.currentImage;
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
      }
      await api.put(`/products/${editingProduct._id}`, {
        name: editValues.name,
        category: editValues.category,
        description: editValues.description,
        materials: editValues.materials,
        price: Number(editValues.price),
        discount: Number(editValues.discount),
        stock: Number(editValues.stock),
        images: [imageUrl],
        featured: editValues.featured,
        trending: editValues.trending,
      });
      setMessage('Product updated');
      setEditingProduct(null);
      fetchProducts();
    } catch {
      setMessage('Could not update product');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMessage('Product deleted');
      fetchProducts();
    } catch {
      setMessage('Could not delete product');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-rust px-4 py-2 text-sm font-medium text-ivory hover:bg-rust/90"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-sage">{message}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-3 rounded border border-ivory/10 bg-ivory/5 p-4 sm:grid-cols-2">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Product name" required
            className="rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/40" />
          <select name="category" value={formData.category} onChange={handleChange} required
            className="rounded border border-ivory/20 bg-[#1f1c1a] px-3 py-2 text-sm">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required rows={2}
            className="sm:col-span-2 rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/40" />
          <input name="materials" value={formData.materials} onChange={handleChange} placeholder="Materials used"
            className="sm:col-span-2 rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/40" />
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price (₹)" required
            className="rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/40" />
          <input name="discount" type="number" value={formData.discount} onChange={handleChange} placeholder="Discount %"
            className="rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/40" />
          <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock quantity" required
            className="rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm placeholder:text-ivory/40" />

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-ivory/70">Product Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-rust file:px-3 file:py-1.5 file:text-ivory"
            />
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="mt-2 h-24 w-24 rounded object-cover" />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="trending" checked={formData.trending} onChange={handleChange} /> Trending
          </label>
          <button type="submit" disabled={uploading} className="sm:col-span-2 rounded bg-indigo px-4 py-2 text-sm font-medium text-ivory hover:bg-indigo/90 disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Save Product'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded border border-ivory/10">
        <table className="w-full text-sm">
          <thead className="bg-ivory/5 text-left text-ivory/60">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-ivory/10">
                <td className="p-3">
                  <img src={p.images?.[0]} alt={p.name} className="h-10 w-10 rounded object-cover" />
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-ivory/70">{p.category?.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 space-x-3">
                  <button onClick={() => openEdit(p)} className="text-indigo hover:underline">Edit</button>
                  <button onClick={() => deleteProduct(p._id)} className="text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-lg rounded border border-ivory/10 bg-[#1f1c1a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="text-ivory/50 hover:text-ivory">✕</button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input name="name" value={editValues.name} onChange={handleEditChange} placeholder="Product name"
                className="rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm" />
              <select name="category" value={editValues.category} onChange={handleEditChange}
                className="rounded border border-ivory/20 bg-[#1f1c1a] px-3 py-2 text-sm">
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <textarea name="description" value={editValues.description} onChange={handleEditChange} rows={2}
                className="sm:col-span-2 rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm" />
              <input name="materials" value={editValues.materials} onChange={handleEditChange} placeholder="Materials"
                className="sm:col-span-2 rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm" />
              <input name="price" type="number" value={editValues.price} onChange={handleEditChange} placeholder="Price"
                className="rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm" />
              <input name="discount" type="number" value={editValues.discount} onChange={handleEditChange} placeholder="Discount %"
                className="rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm" />
              <input name="stock" type="number" value={editValues.stock} onChange={handleEditChange} placeholder="Stock"
                className="rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm" />

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-ivory/70">Product Photo</label>
                <img src={editValues.currentImage} alt="current" className="mb-2 h-16 w-16 rounded object-cover" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="w-full rounded border border-ivory/20 bg-transparent px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-rust file:px-3 file:py-1.5 file:text-ivory"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" checked={editValues.featured} onChange={handleEditChange} /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="trending" checked={editValues.trending} onChange={handleEditChange} /> Trending
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={saveEdit} className="flex-1 rounded bg-indigo px-4 py-2 text-sm font-medium text-ivory hover:bg-indigo/90">
                Save Changes
              </button>
              <button onClick={() => setEditingProduct(null)} className="flex-1 rounded border border-ivory/20 px-4 py-2 text-sm hover:bg-ivory/10">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
