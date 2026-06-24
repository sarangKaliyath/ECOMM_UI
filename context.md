# ECOMM_MICRO_FE — Architecture Context

## Overview
Vite + React micro-frontend monorepo. Four apps connected via **Module Federation** (`@module-federation/vite`), orchestrated with **Turborepo** and **pnpm workspaces**. One shared UI package.

---

## Monorepo Structure

```
ECOMM_MICRO_FE/
├── apps/
│   ├── host/        Shell / container app    (port 3000)
│   ├── catalog/     Product listing remote   (port 3001)  ← fully implemented
│   ├── checkout/    Checkout remote          (port 3002)  ← placeholder
│   └── cart/        Cart remote              (port 3003)  ← placeholder
├── packages/
│   └── ui/          Shared component library (@ecomm/ui)
├── package.json     Root — shared deps + turbo scripts
├── turbo.json       Build pipeline
└── pnpm-workspace.yaml
```

---

## Module Federation Wiring

### Host consumes remotes
```
apps/host/vite.config.ts
  federation({
    name: "host",
    remotes: {
      catalog  → VITE_CATALOG_REMOTE  (dev: http://localhost:3001/remoteEntry.js)
      checkout → VITE_CHECKOUT_REMOTE (dev: http://localhost:3002/remoteEntry.js)
      cart     → VITE_CART_REMOTE     (dev: http://localhost:3003/remoteEntry.js)
    },
    shared: { react, react-dom } (singletons)
  })
```

### Each remote exposes one entry
| App       | Exposed as          | Entry file              |
|-----------|---------------------|-------------------------|
| catalog   | `catalog/CatalogApp`   | `src/bootstrap.tsx`  |
| checkout  | `checkout/CheckoutApp` | `src/bootstrap.tsx`  |
| cart      | `cart/CartApp`         | `src/bootstrap.tsx`  |

### How host loads remotes (`apps/host/src/App.tsx`)
```tsx
const CatalogApp = React.lazy(() => import("catalog/CatalogApp"));
// CheckoutApp and CartApp are imported the same way but commented out
```
Each remote is wrapped in `<Suspense>` + `<ErrorBoundary name="...">`.

### Production remote URLs (`.env.production` in host)
```
VITE_CATALOG_REMOTE=https://ecomm-ui-catalog-app.vercel.app/remoteEntry.js
VITE_CHECKOUT_REMOTE=https://ecomm-ui-checkout-app.vercel.app/remoteEntry.js
VITE_CART_REMOTE=https://ecomm-ui-cart.vercel.app/remoteEntry.js
```

---

## App Details

### apps/host — Shell
```
src/
├── main.tsx               Entry, wraps App in ErrorBoundary
├── App.tsx                Loads remote MFEs, flex layout (Navbar + content)
└── components/Navbar/
    └── Navbar.tsx         Top bar: cart icon (count hardcoded 0), profile dropdown
```
- Styling: Tailwind, black navbar (`#000`)
- Auth state: demo only (local `isLoggedIn` useState, no real auth)
- Cart badge: hardcoded `0` — not connected to cart app yet

### apps/catalog — Product Listing (fully functional)
```
src/
├── bootstrap.tsx          Wraps App in QueryClientProvider
├── App.tsx                Responsive layout: Filters sidebar + Products grid
├── api/products.api.ts    axios.get("http://localhost:8082/product") → Product[]
├── common/card/
│   ├── index.tsx          Product card: image, name, price, quantity controls
│   └── CardSkeleton.tsx   Loading skeleton (10 shown while fetching)
├── containers/
│   ├── products/products.tsx  Grid + sort selector (Newest / Price / Name)
│   └── filters/filters.tsx   Filter sidebar UI (NOT wired to product list yet)
├── hooks/useProducts.ts   Calls React Query productQueries.list()
├── queries/product/
│   ├── productKeys.ts     Key factory
│   └── productQueries.ts  queryOptions({ staleTime: 5min })
├── types/
│   ├── product.ts         Product { id, name, description, price, imageUrl, category, created_at }
│   └── card.ts            CardType { name, imageUrl, price, createdAt }
└── utils/dateHandlers/    isNewProduct(createdAt) — true if ≤ 15 days old
```
- **API:** `GET http://localhost:8082/product` — hardcoded, no env var
- **Responsive grid:** 2 → 3 → 4 → 5 columns (sm / md / lg breakpoints)
- **Filter state is independent of product list** — known gap, not yet connected
- **Cart interaction:** quantity stored in Card local state only — not persisted

### apps/checkout — Placeholder
- Blue placeholder UI, "Checkout Microfrontend" heading
- No real implementation

### apps/cart — Placeholder
- Blue placeholder UI, "Cart Microfrontend" heading
- No real implementation

---

## Shared Package: @ecomm/ui (`packages/ui`)
```
src/
├── index.ts
└── components/ErrorBoundary.tsx   Class component, catches render errors
                                   Props: children, name?, fallback?
                                   Shows "Try again" button on error
```
Used by all 4 apps via `"@ecomm/ui": "workspace:*"`.

---

## Data Flow

### Product display (catalog)
```
bootstrap.tsx (QueryClientProvider)
 └─ App.tsx
     ├─ Filters (local state: categories, priceRange, rating) — UI only
     └─ Products container
         └─ useProducts() → React Query → getAllProducts()
                              └─ axios GET http://localhost:8082/product
                                   └─ Product[]
             └─ sort (local state) → sorted array → Card grid
                 └─ Card: quantity (local state) — Add to Cart is local only
```

### Host shell
```
main.tsx (ErrorBoundary)
 └─ App.tsx
     ├─ Navbar (cart count = 0 hardcoded, demo login)
     └─ Suspense → CatalogApp (lazy from remote)
         (CheckoutApp, CartApp commented out)
```

---

## State Management
| Layer | Tool | Where |
|-------|------|--------|
| Server state / caching | React Query v5 | catalog only |
| Local UI state | useState | everywhere |
| Global cart state | **not implemented** | — |
| Auth state | **not implemented** (demo only) | Navbar |

No Redux / Zustand / Recoil. TanStack Router is installed but not used anywhere.

---

## Key Dependencies (root `package.json`)
| Package | Version | Purpose |
|---------|---------|---------|
| react / react-dom | ^19.2.6 | UI framework (singleton) |
| vite | ^8.0.14 | Build tool |
| @module-federation/vite | ^1.15.5 | Micro-frontend wiring |
| @tanstack/react-query | ^5.100.14 | Data fetching + cache |
| @tanstack/react-router | ^1.170.8 | Routing (installed, unused) |
| tailwindcss | 4.3.0 | Utility CSS |
| typescript | ~6.0.3 | Type system |
| turbo | ^2.9.15 | Monorepo orchestration |
| axios | ^1.18.1 | HTTP client |
| dayjs | ^1.11.21 | Date helpers |
| lucide-react | ^1.21.0 | Icons |

---

## Dev / Build Commands
```bash
pnpm dev          # starts all 4 apps in parallel (turbo --parallel)
pnpm build        # builds all apps in dependency order → apps/*/dist/
pnpm preview      # serves production builds
```

Each app also supports `vite dev` / `vite build` independently.
Build script per app: `tsc -b && vite build`.

---

## HMR Setup (dev only)
- Each remote has `server.hmr` explicitly set to its own port + `cors: true`
- Host has a `remoteHMRBridge([3001, 3002, 3003])` Vite plugin (`apply: "serve"`) that injects a script connecting to each remote's HMR WebSocket — triggers `location.reload()` on remote file changes
- **No production impact** — all dev-server-only config

---

## Known Gaps / Not Yet Implemented
- [ ] Global cart state shared between catalog (Add to Cart) and cart app
- [ ] Real authentication (Navbar has demo-only toggle)
- [ ] Filters wired to product list in catalog
- [ ] Checkout and Cart app implementations
- [ ] Routing (TanStack Router installed but unused)
- [ ] Product detail page
- [ ] Environment-configurable backend API URL (hardcoded `localhost:8082`)
- [ ] Cart badge count in Navbar (hardcoded `0`)
- [ ] Search functionality
