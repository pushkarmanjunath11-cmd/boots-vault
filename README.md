# 🥾 Boots Vault

Premium football boots ecommerce store. Black & green luxury aesthetic.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + inline styles (CSS variables)
- **Database**: Firebase Firestore (orders + products)
- **Payments**: Stripe Checkout
- **Cart**: Zustand (persisted)
- **Fonts**: Bebas Neue (display) + Montserrat (body)

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Fill in your Firebase and Stripe keys in `.env.local`.

### 3. Firebase setup
- Create project at https://console.firebase.google.com
- Enable Firestore (start in test mode)
- Create two collections: `orders` and `products`
- Firestore rules (for production, lock down as needed):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Stripe setup
- Create account at https://stripe.com
- Get publishable + secret keys from Dashboard → Developers → API Keys
- Add to `.env.local`

### 5. Run locally
```bash
npm run dev
```

---

## Admin Panel

**URL**: `/admin/login`

**Default credentials** (change in `app/admin/login/page.tsx`):
- Email: `admin@bootsvault.com`
- Password: `BootsVault2025`

### Admin features:
- **Dashboard** — Live revenue, orders, product count
- **Add Product** — Name, brand, category, price, **multiple image URLs**, sizes, flags
- **Products** — View all boots with image gallery preview, inline edit, delete
- **Orders** — Real-time orders from Firebase, filter by status, expand for details, update status, delete

---

## PDP Image Gallery

The product detail page shows a cycling image gallery:
- **Arrow buttons** to navigate left/right
- **Thumbnail strip** below main image — click to jump to any image
- **Image counter** (e.g. "2 / 4")
- **Auto-cycle** on the homepage hero every 4 seconds

To add images to a product:
1. Go to **Admin → Add Product**
2. Paste image URLs into the image fields (one per URL box)
3. Click **+ Add Image** to add more slots
4. The first image is the main thumbnail on shop/cards

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add all environment variables from `.env.local` to Vercel project settings.

---

## Adding Real Products (from @fire.jaction)

1. Go to Admin → Add Product
2. For each boot:
   - Find the Instagram post on @fire.jaction
   - Right-click images → Copy image address
   - Paste URLs into image fields
   - Set your price (fire.jaction price + ₹1500 markup)
   - Select available sizes
   - Save

---

## File Structure

```
app/
  page.tsx              — Homepage
  shop/page.tsx         — Shop with filters
  products/[id]/page.tsx — PDP with image gallery
  cart/page.tsx         — Cart page
  checkout/page.tsx     — Checkout (Stripe)
  checkout/success/     — Payment success
  api/checkout/route.ts — Stripe API route
  admin/
    page.tsx            — Dashboard
    add-product/        — Add product (with multi-image)
    products/           — Manage products
    orders/             — Manage orders
    login/              — Admin login

lib/
  firebase.ts           — Firebase config
  productService.ts     — Product CRUD (Firestore)
  orderService.ts       — Order CRUD (Firestore)
  store.ts              — Zustand cart
  data.ts               — Placeholder products

types/index.ts          — TypeScript types
```
