import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/products`).then((res) => setProducts(res.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo to-indigo/90 px-4 py-20 text-center text-ivory sm:px-8 sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 16px)',
          }}
        />
        <div className="relative">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-rust">Handmade · Art is Life</p>
          <h1 className="font-display text-5xl font-semibold sm:text-7xl">NiHarts</h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-ivory/80 sm:text-lg">
            Embroidery hoops, Lippan art, resin keychains, and more — every piece crafted by hand with care.
          </p>
          <Link
            to="/products"
            className="mt-9 inline-block rounded-full bg-gradient-to-r from-rust to-rust/80 px-8 py-3.5 font-medium text-ivory shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Shop the Collection
          </Link>
        </div>
        <div className="motif-divider absolute bottom-0 left-0 right-0" />
      </section>

      <section className="px-4 py-16 sm:px-8 sm:py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-rust">Curated for you</p>
          <h2 className="font-display text-3xl font-semibold mt-2">Featured Pieces</h2>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-7">
          {products.map((product) => {
            const discountedPrice = product.price - (product.price * product.discount) / 100;
            return (
              <Link
                key={product._id}
                to="/products"
                className="group overflow-hidden rounded-xl border border-mirror bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square overflow-hidden bg-ivory">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="mt-1.5 font-display text-lg font-semibold text-rust">₹{discountedPrice.toFixed(0)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
