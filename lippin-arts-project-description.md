# Lippin Arts — Project Description

## Overview

Lippin Arts is a full-stack e-commerce web application built for a handmade arts and crafts business selling nine categories of products: Embroidery Hoops, Lippan Art, Pipe Cleaner Bouquets, Keychains, Flower Pots, Hairbands, Clutches, Dancing Flowers, and Fridge Magnets. The platform serves two types of users through two separate, dedicated interfaces: a customer-facing storefront and a seller/admin dashboard, both backed by the same underlying database and business logic.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS v4, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (local instance via Homebrew) |
| Authentication | JWT (JSON Web Tokens), bcrypt password hashing |
| File Uploads | Multer (local disk storage, served statically) |
| Payments | Razorpay (Standard Checkout, test mode; UPI/Cards/Netbanking/Wallets) |
| Icons | Lucide React |

## Architecture

The project is split into two independent applications inside one repository:

```
lippin-arts/
├── client/     React frontend (Vite dev server, port 5173)
└── server/     Express backend (port 5001)
```

The two communicate over REST API calls (`http://localhost:5001/api/...`), with the frontend attaching a JWT bearer token to authenticated requests via an Axios interceptor.

## Core Features Built

### Customer-Facing Storefront
- Account registration with live email format validation and password strength requirements (uppercase, lowercase, number, special character, minimum length), with show/hide password toggles
- Login with JWT-based session persistence
- Home page with a branded hero section and featured products
- Product catalog with category-based filtering sidebar
- Product detail pages with image display, pricing (with discount calculation), stock status, "Add to Cart" and "Buy Now" actions, and a sticky mobile action bar
- Shopping cart with quantity adjustment, item removal, and running total
- Checkout with browser-based GPS location detection (auto-fills address via OpenStreetMap reverse geocoding) and manual address entry
- Real payment processing via Razorpay Standard Checkout, including backend order creation, payment signature verification (HMAC-SHA256), and order persistence
- Order history page showing past orders and their status
- Product reviews restricted to customers who have purchased and received (status: Delivered) that specific product, including photo uploads with each review

### Seller/Admin Dashboard
- Fully separate login interface (`/admin/login`) requiring username, password, and a shared admin passkey, visually distinct (dark theme) from the customer interface
- Dashboard with live business stats: total products, total orders, total customers, pending orders, today's sales, total revenue
- Product management: add new products with direct photo upload, edit any field (price, stock, discount, description, category, image), and delete products
- Category management: view all nine categories, add new ones as needed
- Order management: view all orders with full details (items, shipping address, payment method) in a details panel, update order status through its lifecycle (Pending → Processing → Shipped → Delivered → Cancelled), and view the associated customer's information directly from an order

## Design System

A custom visual identity was built specifically for the brand, moving through two iterations:
- **Color palette:** deep maroon, marigold gold, warm ivory, charcoal, mirror-beige, and sage green — chosen to evoke traditional Indian textile and craft aesthetics
- **Typography:** Fraunces (a characterful serif) for headings, Work Sans for body text
- **Signature motifs:** a dashed "running stitch" divider (referencing embroidery) and a diagonal zigzag "woven border" pattern used as section dividers throughout the site
- Fully responsive layouts across mobile and desktop for every page

## Payment Integration Status

Razorpay is integrated using Standard Web Checkout:
1. Backend creates a Razorpay order via their Orders API
2. Frontend opens Razorpay's hosted payment popup (configured to prioritize UPI, with Cards/Netbanking/Wallets as alternatives)
3. On completion, the backend verifies the payment signature before creating the order record
4. The account is currently in **Test Mode** — payments are fully functional but simulated (no real money moves). A request for Live Mode activation (which requires KYC business verification with Razorpay) has been submitted and is under review.

## Known Next Steps

- Complete Razorpay Live Mode activation once KYC review finishes, then swap test API keys for live keys (no code changes required)
- Deploy the frontend (Vercel) and backend (Render) to production, migrating from local MongoDB to a hosted instance
- Push the codebase to GitHub for version control and to enable deployment pipelines
- Optional remaining features from the original spec: wishlist, coupon codes, order search/filtering, email notifications (order confirmation, shipped, delivered), forgot password/OTP flow

## Development Notes

This project was built end-to-end in a single extended session, starting from zero prior coding experience, including diagnosing and resolving several non-trivial real-world infrastructure issues: a macOS port conflict with AirPlay, ISP-level TLS interference with MongoDB Atlas (resolved by switching to a local MongoDB instance), and various file-path and stale-process debugging along the way.
