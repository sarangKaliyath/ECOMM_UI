# ECOMM_MICRO_FE — Architecture Context

## Overview
Vite + React micro-frontend monorepo. Four apps connected via **Module Federation** (`@module-federation/vite`), orchestrated with **Turborepo** and **pnpm workspaces**. Six shared `@ecomm/*` packages (auth, cart, navigation, orders, profile, ui) provide state, API access, and shared UI across all four apps.

---

## Monorepo Structure

```
ECOMM_MICRO_FE/
├── apps/
│   ├── host/        Shell / container app    (port 3000)  — routing, auth bootstrap, loads remotes
│   ├── catalog/     Product listing remote   (port 3001)  ← fully implemented
│   ├── checkout/    Checkout remote          (port 3002)  ← fully implemented
│   └── cart/        Cart remote              (port 3003)  ← fully implemented
├── packages/
│   ├── auth/        @ecomm/auth        Session store, login/signup/verification, token refresh
│   ├── cart/         @ecomm/cart        Cart store + React Query hooks against the Cart Service
│   ├── navigation/   @ecomm/navigation  Cross-remote navigation bridge (zustand → host router)
│   ├── orders/       @ecomm/orders      Order history / order detail API client + hooks
│   ├── profile/      @ecomm/profile     User profile API client + hooks
│   └── ui/           @ecomm/ui          Shared components (auth cards, profile/order sections, toasts)
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
    shared: {
      react, react-dom, zustand, @tanstack/react-query (singletons)
      @ecomm/cart, @ecomm/auth, @ecomm/navigation (singletons)
    }
  })
```

### Each remote exposes one entry
| App       | Exposed as          | Entry file              |
|-----------|---------------------|-------------------------|
| catalog   | `catalog/CatalogApp`   | `src/bootstrap.tsx`  |
| checkout  | `checkout/CheckoutApp` | `src/bootstrap.tsx`  |
| cart      | `cart/CartApp`         | `src/bootstrap.tsx`  |

### How host loads remotes
Remotes are lazy-loaded from within TanStack Router route components (`apps/host/src/routes/*.tsx`), not eagerly in `App.tsx` — see the routing section below. Each is wrapped in `<Suspense>` + `<ErrorBoundary name="...">`.

### Production remote URLs (`apps/host/.env.production`)
```
VITE_CATALOG_REMOTE=https://ecomm-ui-catalog-app.vercel.app/remoteEntry.js
VITE_CHECKOUT_REMOTE=https://ecomm-ui-checkout-app.vercel.app/remoteEntry.js
VITE_CART_REMOTE=https://ecomm-ui-cart.vercel.app/remoteEntry.js
```
Note: `apps/host/.env.production` currently does **not** set `VITE_AUTH_BASE_URL` / `VITE_GOOGLE_OAUTH_URL` — likely an oversight.

---

## App Details

### apps/host — Shell
```
src/
├── main.tsx               Entry, wraps App in ErrorBoundary
├── App.tsx                Bootstraps QueryClientProvider, AuthInitializer, wires
│                           @ecomm/navigation's navigate() to the router, renders RouterProvider
├── router.ts               Builds routeTree via rootRoute.addChildren([...]), createRouter()
├── routes/
│   ├── __root.tsx          Persistent Navbar + <Outlet />
│   ├── index.tsx            "/"                      → lazy-loads catalog/CatalogApp
│   ├── cart.tsx              "/cart"                  → lazy-loads cart/CartApp
│   ├── checkout.tsx          "/checkout"              → lazy-loads checkout/CheckoutApp; auth-guarded (beforeLoad)
│   ├── login.tsx             "/login"                 → login + email-verification step; redirects if already authed
│   ├── signup.tsx             "/signup"                → signup + email-verification step; redirects if already authed
│   ├── forgot-password.tsx    "/forgot-password"       → request → verify → reset → done
│   ├── callback.tsx           "/oauth/callback"        → Google OAuth callback, refreshTokenApi() + usePostAuth()
│   ├── profile.tsx            "/profile"               → auth-guarded, renders @ecomm/ui ProfileSection
│   └── orders/
│       ├── history.tsx        "/orders"                → auth-guarded, renders OrderHistorySection
│       └── confirmation.tsx   "/orders/confirmation"   → reads orderNumber/status search params, useOrderDetail
└── components/Navbar/
    └── Navbar.tsx          Top bar: cart icon, profile dropdown
```
- Auth: real session bootstrap (`useBootstrapSession`, `useTokenRefresh`, `waitForAuthReady` from `@ecomm/auth`) — app doesn't render routes until auth state is resolved
- Routing: **TanStack Router is fully wired up** (previously "installed but unused" — no longer accurate)
- Remote↔host navigation bridge: `useNavigationStore.getState().setNavigate((path) => router.navigate({ to: path as any }))` wired at module scope in `App.tsx`, so remotes (cart, catalog) can trigger host navigation via `@ecomm/navigation` without depending on the router directly

### apps/catalog — Product Listing (fully functional)
```
src/
├── bootstrap.tsx          Wraps App in QueryClientProvider
├── App.tsx                Responsive layout: Filters sidebar + Products grid, wrapped in ErrorBoundary
├── api/products.api.ts    axios.get(VITE_BASE_API_URL + "product") → Product[]
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
- **API:** `GET {VITE_BASE_API_URL}product` — Product Service, dev default `http://localhost:8082/`
- **Responsive grid:** 2 → 3 → 4 → 5 columns (sm / md / lg breakpoints)
- **Filter state is independent of product list** — known gap, not yet connected
- **Cart interaction:** quantity stored in Card local state only — not persisted

### apps/checkout — Checkout (fully functional)
```
src/
└── App.tsx   ShippingAddress, ProceedToPay, OrderSummary containers;
              login-gated via useAuthStore + LoginPromptModal; Toaster for notifications
```
- Depends on `@ecomm/cart` (`VITE_CART_BASE_API_URL`, dev default `http://localhost:8085/`) and `@ecomm/orders` (`VITE_ORDERS_BASE_URL`, fallback `http://localhost:8086`)
- No longer a placeholder — real implementation

### apps/cart — Cart (fully functional)
```
src/
└── App.tsx   Thin wrapper: renders CartWallet (from ./containers) inside Suspense + ErrorBoundary
```
- Backed by `@ecomm/cart` package (zustand store + React Query hooks against the Cart Service)
- `apps/cart/.env.development` still defines `VITE_BASE_API_URL=http://localhost:8082` but nothing in `apps/cart/src` reads it — likely vestigial from an earlier placeholder version; the real cart data path goes through `@ecomm/cart`'s `VITE_CART_BASE_API_URL`
- No longer a placeholder — real implementation

---

## Shared Packages (`packages/*`)

### @ecomm/auth (`packages/auth`)
Zustand session store + everything auth-related, shared by all apps.
```ts
useAuthStore
useLogin, useSignup, useLogout, useLogoutAll, useSendVerification, useConfirmVerification, useResetPassword
useTokenRefresh, useBootstrapSession, waitForAuthReady
refreshAccessToken, attachAuthInterceptors   // transparent access-token refresh on 401
handleSessionInvalid, redirectToLogin
getAuthErrorMessage, getErrorStatus
loginApi, signupApi, refreshTokenApi, logoutApi, logoutAllApi, sendVerificationApi, confirmVerificationApi, resetPasswordApi
// + types: SignupResponse, RefreshResponse, VerificationType, ConfirmVerificationResponse
```
Backed by `VITE_AUTH_BASE_URL` (no fallback — must be set). `VerificationType` is `"LOGIN" | "PASSWORD_RESET" | "EMAIL_VERIFICATION"`.

### @ecomm/cart (`packages/cart`)
```ts
useCartStore, cartKeys
useUpsertCartItem, useGetCartItems, useDeleteCartItem, useUpdateCartItemQuantity, useClearCartItem
useCartSync   // merges guest cart into user cart on login
mergeCartApi
// + types: CartItem, CartResponseDto, CartItemDto
```
Backed by `VITE_CART_BASE_API_URL` (+ `cart` path suffix), dev default `http://localhost:8085/`.

### @ecomm/navigation (`packages/navigation`)
```ts
useNavigationStore   // holds a navigate(path) function set by the host router
```
Tiny cross-remote navigation bridge — lets remotes navigate the host without a direct router dependency.

### @ecomm/orders (`packages/orders`)
```ts
export * from "./api"; export * from "./types"; export * from "./mutations"; export * from "./ordersKeys";
// includes useOrderDetail, useMyOrders, useMyPendingOrders, useRetryPayment
```
Backed by `VITE_ORDERS_BASE_URL`, fallback `http://localhost:8086`.

### @ecomm/profile (`packages/profile`)
```ts
export * from "./api"; export * from "./types"; export * from "./mutations"; export * from "./profileKeys";
```
Backed by `VITE_PROFILE_BASE_URL`, fallback `http://localhost:8087`.

### @ecomm/ui (`packages/ui`)
```ts
ErrorBoundary, LoginForm, SignupForm, AuthCard, LoginPromptModal,
ProfileSection, OrderHistorySection, VerifyCodeCard, ForgotPasswordCard, ResetPasswordCard,
Toaster, toast   // re-exported from sonner
```
Depends on `@ecomm/profile` and `@ecomm/orders`. Used by all 4 apps via `"@ecomm/ui": "workspace:*"`.

None of the six packages ship a pre-built `dist` or define a build step — they're consumed as raw TS/TSX source via `workspace:*` and compiled by each consuming app's own Vite build.

---

## Data Flow

### Auth (host)
```
main.tsx → App.tsx
  AuthInitializer: useBootstrapSession() + useTokenRefresh() → waitForAuthReady()
    └─ attachAuthInterceptors() on the shared axios instance (401 → refreshAccessToken → retry)
  └─ RouterProvider renders once auth state is resolved
```

### Product display (catalog)
```
bootstrap.tsx (QueryClientProvider)
 └─ App.tsx
     ├─ Filters (local state: categories, priceRange, rating) — UI only
     └─ Products container
         └─ useProducts() → React Query → getAllProducts()
                              └─ axios GET {VITE_BASE_API_URL}product
                                   └─ Product[]
             └─ sort (local state) → sorted array → Card grid
                 └─ Card: quantity (local state) — Add to Cart is local only
```

### Cart → Checkout → Orders
```
@ecomm/cart (zustand + React Query) ── shared singleton across host/catalog/cart/checkout
  └─ apps/cart → CartWallet renders live cart contents
  └─ apps/checkout → ShippingAddress + OrderSummary read cart, ProceedToPay creates the order
       └─ @ecomm/orders → useOrderDetail (orders/confirmation route), useMyOrders / useMyPendingOrders (orders/history route)
```

### Host shell
```
main.tsx (ErrorBoundary)
 └─ App.tsx (auth bootstrap, navigation bridge)
     ├─ Navbar
     └─ RouterProvider
         ├─ "/"          → Suspense → CatalogApp (lazy from remote)
         ├─ "/cart"       → Suspense → CartApp (lazy from remote)
         └─ "/checkout"   → Suspense → CheckoutApp (lazy from remote), auth-guarded
```

---

## State Management
| Layer | Tool | Where |
|-------|------|--------|
| Server state / caching | React Query v5 | all apps |
| Local UI state | useState | everywhere |
| Global cart state | Zustand (`@ecomm/cart`) | shared: host, catalog, cart, checkout |
| Auth / session state | Zustand (`@ecomm/auth`) | shared: all apps, bootstrapped in host |
| Cross-remote navigation | Zustand (`@ecomm/navigation`) | shared: remotes → host router |

No Redux / Recoil. TanStack Router is now fully wired up and in active use (host).

---

## Key Dependencies (root `package.json`)
| Package | Version | Purpose |
|---------|---------|---------|
| react / react-dom | ^19.2.6 | UI framework (singleton) |
| vite | ^8.0.14 | Build tool |
| @module-federation/vite | ^1.15.5 | Micro-frontend wiring |
| @tanstack/react-query | ^5.100.14 | Data fetching + cache |
| @tanstack/react-router | ^1.170.8 | Routing — in active use (host) |
| zustand | ^5.0.0 | Client state (auth, cart, navigation) |
| tailwindcss | 4.3.0 | Utility CSS |
| typescript | ~6.0.3 | Type system |
| turbo | ^2.9.15 | Monorepo orchestration |
| axios | ^1.18.1 | HTTP client |
| dayjs | ^1.11.21 | Date helpers |
| lucide-react | ^1.21.0 | Icons |
| sonner | (via `@ecomm/ui`) | Toast notifications |

---

## Environment Variables
No `.env.example` files exist yet — only real `.env.development` / `.env.production` per app (none at root or in `packages/*`).

| Variable | Used by | Points to | Dev default |
|---|---|---|---|
| `VITE_CATALOG_REMOTE` | host | catalog `remoteEntry.js` | `http://localhost:3001/remoteEntry.js` |
| `VITE_CHECKOUT_REMOTE` | host | checkout `remoteEntry.js` | `http://localhost:3002/remoteEntry.js` |
| `VITE_CART_REMOTE` | host | cart `remoteEntry.js` | `http://localhost:3003/remoteEntry.js` |
| `VITE_AUTH_BASE_URL` | host (`@ecomm/auth`) | Auth Service | `http://localhost:8081` (no fallback — required) |
| `VITE_GOOGLE_OAUTH_URL` | host | Auth Service Google OAuth entry | `http://localhost:8081/oauth2/authorization/google` |
| `VITE_CART_BASE_API_URL` | host, checkout (`@ecomm/cart`) | Cart Service | `http://localhost:8085/` |
| `VITE_ORDERS_BASE_URL` | checkout (`@ecomm/orders`) | Ordering Service | `http://localhost:8086` (has fallback) |
| `VITE_PROFILE_BASE_URL` | `@ecomm/profile` | Profile Service | `http://localhost:8087` (has fallback) |
| `VITE_BASE_API_URL` | catalog | Product Service | `http://localhost:8082/` |

Production `.env` files for catalog, checkout, and cart still hold placeholder values (`"should-be-deployed-url"`, `"cart-server-prod-url"`, `"order-server-prod-url"`, `"prod-cart-service-url"`) rather than real deployed URLs.

---

## Dev / Build Commands
```bash
pnpm dev          # starts all 4 apps in parallel (turbo --parallel)
pnpm build        # builds all apps in dependency order → apps/*/dist/
pnpm preview      # serves production builds
```

Each app also supports `vite dev` / `vite build` independently.
Build script per app: `tsc -b && vite build`.
`packageManager: pnpm@10.33.0` (root `package.json`).

---

## HMR Setup (dev only)
- Each remote has `server.hmr` explicitly set to its own port + `cors: true`
- Host has a `remoteHMRBridge([3001, 3002, 3003])` Vite plugin (`apply: "serve"`) that injects a script connecting to each remote's HMR WebSocket — triggers `location.reload()` on remote file changes
- **No production impact** — all dev-server-only config

---

## Known Gaps / Not Yet Implemented
- [ ] Filters wired to product list in catalog (filter state is local/independent of the product list)
- [ ] Product detail page
- [ ] Search functionality
- [ ] Production `.env` files for catalog/checkout/cart still hold placeholder URLs, not real deployed ones
- [ ] `apps/host/.env.production` missing `VITE_AUTH_BASE_URL` / `VITE_GOOGLE_OAUTH_URL`
- [ ] No `.env.example` files anywhere — onboarding relies on reading real `.env.development` files
- [ ] `apps/cart/.env.development`'s `VITE_BASE_API_URL` appears unused/vestigial (cart data flows through `@ecomm/cart`'s `VITE_CART_BASE_API_URL` instead)
- [ ] No `lint`, `preview`, or `test` task declared in `turbo.json`'s pipeline (only `dev` and `build`)
