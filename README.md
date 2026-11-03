# Lippin (Client + Server)

This repository contains a simple e-commerce app split into:

- **Client**: React + Vite
  - Location: `lippin-arts/client`
- **Server**: Node.js + Express + Mongoose
  - Location: `lippin-arts/server`

---

## Project Structure

```
Lippin/
  lippin-arts/
    client/   # React frontend
    server/   # Express backend
```

---

## Prerequisites

- Node.js (recommended: 18+)
- MongoDB

---

## Configure Environment Variables

### Server
Create a `.env` file inside `lippin-arts/server/` with at least:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=5001
```

> Note: the server uses `dotenv` (`require('dotenv').config();`).

---

## Setup & Run

Open two terminals: one for server and one for client.

### 1) Server

```bash
cd lippin-arts/server
npm install
npm run dev || node server.js
```

Server entry: `lippin-arts/server/server.js`

The server exposes APIs under:
- `http://localhost:5001/api/auth`
- `http://localhost:5001/api/products`
- `http://localhost:5001/api/cart`
- `http://localhost:5001/api/reviews`
- `http://localhost:5001/api/orders`
- `http://localhost:5001/api/admin`
- `http://localhost:5001/api/users`
- `http://localhost:5001/api/categories`
- `http://localhost:5001/api/upload`
- `http://localhost:5001/api/payment`

(Exact routes are implemented in `lippin-arts/server/routes/*`.)

### 2) Client

```bash
cd lippin-arts/client
npm install
npm run dev
```

Client entry:
- `lippin-arts/client/src/main.jsx`
- `lippin-arts/client/src/App.jsx`

---

## Build

### Client

```bash
cd lippin-arts/client
npm run build
```

### Server

Server is plain Node.js; no separate build step is required.

---

## Commit / Push

This repo was created to include the full project (client + server) and push it to GitHub.

---

## Notes

- If `MONGO_URI` is missing, the server will still start but MongoDB connection will fail (server logs a warning).
- Static uploads are served from:
  - `http://localhost:<PORT>/uploads`
  - backed by `lippin-arts/server/uploads`

