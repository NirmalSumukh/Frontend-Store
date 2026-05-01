# Leema E-Commerce Frontend

React + Vite + TypeScript storefront for **store.leemasmart.com**, connected to the Saleor GraphQL backend and the Shiprocket headless checkout.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | React 18 + Vite 7 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| GraphQL | Apollo Client 3 |
| State | Zustand |
| Routing | React Router v6 |
| Checkout | Shiprocket Headless Checkout |
| Animation | Framer Motion |
| Forms | React Hook Form |

---

## Project Structure

```
frontend/
├── .devcontainer/          # VS Code Dev Container config
├── src/
│   ├── assets/             # Static images, icons
│   ├── components/         # Feature-grouped React components
│   ├── hooks/              # Custom React hooks (business logic)
│   ├── lib/                # Third-party integrations & utilities
│   ├── pages/              # Route-level page components
│   ├── styles/             # Global CSS overrides
│   ├── types/              # Shared TypeScript type definitions
│   ├── App.tsx             # Root component & router setup
│   └── main.tsx            # React DOM entry point
├── Dockerfile              # Production multi-stage build (Nginx)
├── Dockerfile.dev          # Dev build with Vite HMR
├── docker-compose.yml      # Production compose (joins e-commerce-network)
├── nginx.conf              # Nginx SPA config for store.leemasmart.com
├── .env.example            # Template for environment variables
└── vite.config.ts          # Vite config with path aliases & proxy
```

---

## Components (`src/components/`)

| Folder | Responsibility |
| :--- | :--- |
| `account/` | User profile, order history, and account settings. |
| `auth/` | Login, register, and password reset forms. |
| `cart/` | Cart sidebar, item list, checkout flow via Shiprocket. |
| `catalog/` | Category pages, product grids, filtering, and sorting. |
| `content/` | Dynamic CMS content rendering (banners, carousels, blocks). |
| `error/` | Error boundaries and graceful fallback UI. |
| `homepage/` | Sections unique to the landing page (hero, featured, etc.). |
| `layout/` | Header (with announcement bar), Footer, and navigation. |
| `product/` | Product detail page — gallery, specs, and add-to-cart. |
| `ui/` | Generic primitives — Buttons, Inputs, Modals, Spinners. |

---

## Library (`src/lib/`)

| File | Description |
| :--- | :--- |
| `apollo-client.ts` | Apollo Client setup and Saleor GraphQL endpoint config. |
| `constants.ts` | App-wide constants (channel slugs, pagination limits, etc.). |
| `content-queries.ts` | Pre-built GraphQL queries for fetching CMS/content data. |
| `google-auth.ts` | Google OAuth helper utilities. |
| `gst-validation.ts` | Indian GST number regex validation logic. |
| `shiprocket.ts` | Shiprocket headless checkout token generation and popup trigger. |
| `utils.ts` | General helper functions (formatting, class merging, etc.). |

---

## Hooks (`src/hooks/`)

| File | Description |
| :--- | :--- |
| `useAuth.ts` | Full authentication logic (login, register, token refresh). |
| `useCart.ts` | Cart state access via Zustand store. |
| `useCartValidation.ts` | Checks for out-of-stock items and removes them automatically. |
| `useCatalogLogic.ts` | Filtering, sorting, and pagination for catalog pages. |
| `useChannel.ts` | Retrieves the active Saleor channel slug. |
| `useCheckoutLogic.ts` | Orchestrates the checkout process and coupon logic. |
| `useHomepageContent.ts` | Fetches homepage banners and promotional content. |
| `useImageUpload.ts` | Handles avatar/image upload for user accounts. |
| `useSaleor.ts` | Core data-fetching hook for Saleor products and categories. |
| `useSwipeable.tsx` | Touch/swipe gesture detection for carousels. |
| `useUserChannel.ts` | Detects and stores the user's preferred channel. |

---

## Pages (`src/pages/`)

| File | Route |
| :--- | :--- |
| `index.tsx` | `/` — Homepage |
| `catalog.tsx` | `/catalog` — Product listing |
| `product.tsx` | `/product/:id` — Product detail |
| `cart.tsx` | `/cart` — Cart & checkout |
| `account.tsx` | `/account` — User account |
| `deals.tsx` | `/deals` — Deals & offers |
| `faq.tsx` | `/faq` — FAQ |
| `privacy-policy.tsx` | `/privacy-policy` |
| `terms-conditions.tsx` | `/terms-conditions` |
| `shipping-and-delivery.tsx` | `/shipping-and-delivery` |
| `return-replacement.tsx` | `/return-replacement` |
| `warranty-form.tsx` | `/warranty-form` |
| `warranty-guidelines.tsx` | `/warranty-guidelines` |
| `csr-policy.tsx` | `/csr-policy` |
| `e-waste-management.tsx` | `/e-waste-management` |
| `about.tsx` | `/about` |
| `contact.tsx` | `/contact` |

---

## Environment Variables

Copy `.env.example` to `.env.local` for local development. **Never commit `.env.local`.**

| Variable | Description |
| :--- | :--- |
| `VITE_SALEOR_API_URL` | Saleor GraphQL API endpoint |
| `VITE_SITE_NAME` | Display name for the store |
| `VITE_SHIPROCKET_APP_URL` | Shiprocket app service base URL |
| `VITE_TOKEN_STORAGE_KEY` | LocalStorage key for auth token |
| `VITE_REFRESH_TOKEN_KEY` | LocalStorage key for refresh token |
| `VITE_GA_TRACKING_ID` | (Optional) Google Analytics ID |
| `VITE_GTM_ID` | (Optional) Google Tag Manager ID |

---

## Docker Deployment

### Prerequisites
- Ensure the shared Docker network exists on your server:
  ```bash
  docker network create e-commerce-network
  ```
  > This network is defined in [E-Commerce-Network](https://github.com/NirmalSumukh/E-Commerce-Network.git). Run that compose stack first.

### Deploy to production (one command)

```bash
# On your server, after git pull:

# 1. Create your environment file as .env (so Docker Compose finds it automatically)
cp .env.example .env

# 2. Build and start
docker compose up -d --build
```

This will:
1. Build the React app with all `VITE_` args (read from `.env.local` or shell env).
2. Serve the compiled static files via Nginx on port 80.
3. Join the `e-commerce-network` so the reverse proxy can route `store.leemasmart.com` to this container.

### Local development

```bash
# Standard npm dev server
npm install
npm run dev
```

Or, using Docker Dev Container in VS Code, open the folder and choose **"Reopen in Container"**.

---

## Node.js Requirements

| Tool | Version |
| :--- | :--- |
| Node.js | >= 20.0.0 |
| npm | >= 10.0.0 |
