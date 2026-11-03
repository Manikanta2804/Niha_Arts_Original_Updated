import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import { API_URL } from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [eligible, setEligible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchReviews = () => axios.get(`${API_URL}/api/reviews/${id}`).then((res) => setReviews(res.data));
  const checkEligibility = () => {
    if (!user) return;
    api.get(`/reviews/${id}/eligibility`).then((res) => setEligible(res.data.eligible)).catch(() => {});
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${API_URL}/api/products/${id}`).then((res) => {
      setProduct(res.data);
      axios.get(`${API_URL}/api/products`).then((allRes) => {
        setSimilar(allRes.data.filter((p) => p.category?._id === res.data.category?._id && p._id !== res.data._id).slice(0, 4));
      });
    });
    fetchReviews();
    checkEligibility();
  }, [id]);

  const handleAddToCart = async () => {
    if (!localStorage.getItem('token')) return navigate('/login');
    setBusy(true);
    try {
      await api.post('/cart', { productId: product._id, quantity: 1 });
      setMessage('Added to cart');
      setTimeout(() => setMessage(''), 2000);
    } catch { setMessage('Could not add to cart'); } finally { setBusy(false); }
  };

  const handleBuyNow = async () => {
    if (!localStorage.getItem('token')) return navigate('/login');
    setBusy(true);
    try {
      await api.post('/cart', { productId: product._id, quantity: 1 });
      navigate('/checkout');
    } catch { setMessage('Could not proceed to checkout'); setBusy(false); }
  };

  const handleReviewImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setReviewImages(files);
    setReviewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      let imageUrls = [];
      if (reviewImages.length > 0) {
        const data = new FormData();
        reviewImages.forEach((f) => data.append('images', f));
        const uploadRes = await axios.post(`${API_URL}/api/upload/multiple`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrls = uploadRes.data.urls.map((u) => (u.startsWith('http') ? u : `${API_URL}${u}`));
      }
      await api.post('/reviews', { productId: id, rating, comment, images: imageUrls });
      setComment(''); setRating(5); setReviewImages([]); setReviewImagePreviews([]);
      fetchReviews();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not submit review');
    } finally { setSubmittingReview(false); }
  };

  if (!product) return <p className="p-8">Loading...</p>;

  const discountedPrice = product.price - (product.price * product.discount) / 100;
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="pb-28 sm:pb-8">
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-2xl border-2 border-mirror bg-white shadow-lg">
              <div className="aspect-square overflow-hidden">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <svg className="absolute -top-1 -left-1 h-14 w-14 text-rust/40" viewBox="0 0 40 40" fill="none">
                <path d="M2 20 Q2 2 20 2" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="2" cy="20" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">{product.category?.name}</p>
            <h1 className="font-display text-4xl font-semibold mt-2 leading-tight sm:text-5xl">{product.name}</h1>

            {avgRating && (
              <div className="mt-4 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-sage/15 px-3 py-1.5 text-sm font-semibold text-sage">★ {avgRating}</span>
                <span className="text-sm text-charcoal/50">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              {product.discount > 0 && <span className="text-lg text-charcoal/40 line-through">₹{product.price}</span>}
              <span className="font-display text-4xl font-bold text-rust">₹{discountedPrice.toFixed(0)}</span>
              {product.discount > 0 && (
                <span className="rounded-full bg-gradient-to-r from-rust to-rust/70 px-3 py-1 text-xs font-bold text-ivory shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <p className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${product.stock > 0 ? 'text-sage' : 'text-red-500'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-sage' : 'bg-red-500'}`} />
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            <div className="motif-divider my-7 rounded-full" />

            <p className="leading-relaxed text-charcoal/80">{product.description}</p>
            {product.materials && (
              <p className="mt-4 text-sm text-charcoal/60"><span className="font-semibold text-charcoal">Materials:</span> {product.materials}</p>
            )}

            {message && <p className="mt-4 rounded-lg bg-sage/15 px-4 py-2.5 text-sm font-medium text-sage">{message}</p>}

            <div className="mt-9 hidden gap-4 sm:flex">
              <button onClick={handleAddToCart} disabled={product.stock === 0 || busy}
                className="flex-1 rounded-xl border-2 border-indigo px-6 py-3.5 font-semibold text-indigo hover:bg-indigo hover:text-ivory disabled:opacity-40 transition-all shadow-sm hover:shadow-md">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0 || busy}
                className="flex-1 rounded-xl bg-gradient-to-r from-rust to-rust/85 px-6 py-3.5 font-semibold text-ivory hover:shadow-lg disabled:opacity-40 transition-all shadow-md">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-mirror bg-ivory/95 backdrop-blur-sm p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:hidden">
        <button onClick={handleAddToCart} disabled={product.stock === 0 || busy}
          className="flex-1 rounded-xl border-2 border-indigo px-4 py-3 text-sm font-semibold text-indigo disabled:opacity-40">
          Add to Cart
        </button>
        <button onClick={handleBuyNow} disabled={product.stock === 0 || busy}
          className="flex-1 rounded-xl bg-gradient-to-r from-rust to-rust/85 px-4 py-3 text-sm font-semibold text-ivory disabled:opacity-40 shadow-md">
          Buy Now
        </button>
      </div>

      <div className="px-4 sm:px-8">
        <div className="motif-divider my-12 rounded-full" />

        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold mb-7">Reviews</h2>

          {reviews.length === 0 && (
            <p className="mb-7 rounded-xl border-2 border-dashed border-mirror bg-white p-8 text-center text-sm text-charcoal/50">
              No reviews yet — be the first to share your experience.
            </p>
          )}

          <div className="space-y-4 mb-9">
            {reviews.map((r) => (
              <div key={r._id} className="rounded-xl border border-mirror bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{r.user?.fullName || 'Anonymous'}</span>
                  <span className="text-rust text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="mt-2 text-sm text-charcoal/80">{r.comment}</p>
                {r.images?.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {r.images.map((img, i) => <img key={i} src={img} alt="review" className="h-16 w-16 rounded-lg object-cover border border-mirror" />)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {eligible ? (
            <form onSubmit={handleSubmitReview} className="rounded-xl border border-mirror bg-white p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Write a review</h3>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium">Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-lg border border-mirror px-3 py-2 text-sm">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium">Comment</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={3}
                  className="w-full rounded-lg border border-mirror px-3 py-2 text-sm focus:border-indigo focus:outline-none" />
              </div>
              <div className="mb-5">
                <label className="mb-1.5 block text-sm font-medium">Add photos (optional, up to 3)</label>
                <input type="file" accept="image/*" multiple onChange={handleReviewImageChange}
                  className="w-full rounded-lg border border-mirror px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo file:px-3 file:py-1.5 file:text-ivory" />
                {reviewImagePreviews.length > 0 && (
                  <div className="mt-2 flex gap-2">{reviewImagePreviews.map((src, i) => <img key={i} src={src} alt="preview" className="h-14 w-14 rounded-lg object-cover" />)}</div>
                )}
              </div>
              <button type="submit" disabled={submittingReview}
                className="rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-indigo/90 disabled:opacity-50 shadow-sm hover:shadow transition-all">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p className="rounded-xl border border-mirror bg-white p-5 text-sm text-charcoal/50">
              Only customers who have purchased and received this product can leave a review.
            </p>
          )}
        </div>

        {similar.length > 0 && (
          <div className="mt-16 pb-4">
            <h2 className="font-display text-2xl font-semibold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {similar.map((p) => {
                const price = p.price - (p.price * p.discount) / 100;
                return (
                  <Link key={p._id} to={`/products/${p._id}`} className="group rounded-xl border border-mirror bg-white p-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="aspect-square overflow-hidden rounded-lg bg-ivory">
                      <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium line-clamp-2">{p.name}</h3>
                    <p className="mt-1 font-display font-semibold text-rust">₹{price.toFixed(0)}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
