# ECOMM Micro-Frontend

The browser-facing layer of the **ECOMM** e-commerce platform. A Vite + React micro-frontend monorepo — four independently deployable apps wired together with **Module Federation**, orchestrated by **Turborepo**, sharing state and API access through a set of `@ecomm/*` packages.

## How it fits in the platform

This is the browser-facing layer of the ECOMM platform. It talks directly to the backend Spring Boot services below, each independently deployable and registered with/discovered through Eureka:

| Service | Responsibility |
|---|---|
| [Auth Service](https://github.com/sarangKaliyath/ECOMM_Auth_ServiceApplication) | Identity, tokens, sessions |
| [Profile Service](https://github.com/sarangKaliyath/ECOMM_Profile_Service_Application) | User profile data (created reactively on signup) |
| [Product Service](https://github.com/sarangKaliyath/ECOMM_Product_ServiceApplication) | Product catalog |
| [Cart Service](https://github.com/sarangKaliyath/ECOMM_Cart_Service_Application) | Shopping cart |
| [Ordering Service](https://github.com/sarangKaliyath/ECOMM_Ordering_Service_Application) | Order lifecycle |
| [Payment Service](https://github.com/sarangKaliyath/ECOMM_Payment_Gateway_Service_Application) | Payment processing |
| [Email Service](https://github.com/sarangKaliyath/ECOMM_Email_Service_Application) | Transactional email delivery |
| [Service Discovery](https://github.com/sarangKaliyath/ECOMM_Service_Discovery_Application) | Eureka registry |
| **Frontend** [*(this repo)*](https://github.com/sarangKaliyath/ECOMM_UI) | Browser UI — this micro-frontend monorepo |

## Monorepo structure

```
ECOMM_MICRO_FE/
├── apps/
│   ├── host/        Shell app — routing, auth bootstrap, loads remotes   (:3000)
│   ├── catalog/     Product listing remote                               (:3001)
│   ├── checkout/    Checkout remote                                      (:3002)
│   └── cart/        Cart remote                                         (:3003)
├── packages/
│   ├── auth/        @ecomm/auth        Session store, login/signup/verification, token refresh
│   ├── cart/         @ecomm/cart        Cart store + React Query hooks against the Cart Service
│   ├── navigation/   @ecomm/navigation  Cross-remote navigation bridge (zustand store → host router)
│   ├── orders/       @ecomm/orders      Order history / order detail API client + hooks
│   ├── profile/      @ecomm/profile     User profile API client + hooks
│   └── ui/           @ecomm/ui          Shared components (auth cards, profile & order-history sections, toasts)
├── package.json      Root — shared deps + turbo scripts
├── turbo.json         Build pipeline
└── pnpm-workspace.yaml
```

## Apps

| App | Module Federation name | Exposes | Dev port |
|---|---|---|---|
| **host** | `host` | — (consumer only) | 3000 |
| **catalog** | `catalog` | `catalog/CatalogApp` | 3001 |
| **checkout** | `checkout` | `checkout/CheckoutApp` | 3002 |
| **cart** | `cart` | `cart/CartApp` | 3003 |

`host` owns app-wide routing (TanStack Router), bootstraps the auth session on load, and lazy-loads the other three as remotes. `react`, `react-dom`, `zustand`, and `@tanstack/react-query` are shared as Module Federation singletons across all four; host additionally shares `@ecomm/cart`, `@ecomm/auth`, and `@ecomm/navigation`.

### Routes (host)

| Path | Renders |
|---|---|
| `/` | `catalog/CatalogApp` |
| `/cart` | `cart/CartApp` |
| `/checkout` | `checkout/CheckoutApp` — requires auth |
| `/login` | Login (+ email verification step) |
| `/signup` | Signup (+ email verification step) |
| `/forgot-password` | Password-reset flow (request → verify → reset) |
| `/oauth/callback` | Google OAuth callback |
| `/profile` | Profile — requires auth |
| `/orders` | Order history — requires auth |
| `/orders/confirmation` | Order confirmation, reads `orderNumber`/`status` from the URL |

## Shared packages (`@ecomm/*`)

| Package | Purpose |
|---|---|
| `@ecomm/auth` | Zustand session store, login/signup/logout/logout-all, email-verification and password-reset mutations, axios interceptors that transparently refresh the access token, and session-bootstrap gating used by the host shell. |
| `@ecomm/cart` | Cart state (zustand) + React Query hooks against the Cart Service, plus a merge-on-login sync hook. |
| `@ecomm/navigation` | A zustand store holding a `navigate(path)` function, wired to the host's TanStack Router — lets remotes trigger host-level navigation without depending on the router directly. |
| `@ecomm/orders` | API client + React Query hooks/types for order history and order detail/confirmation. |
| `@ecomm/profile` | API client + React Query hooks/types for the profile section. |
| `@ecomm/ui` | Shared presentational components: auth cards (`LoginForm`, `SignupForm`, `VerifyCodeCard`, `ForgotPasswordCard`, `ResetPasswordCard`), `ProfileSection`, `OrderHistorySection`, `LoginPromptModal`, `ErrorBoundary`, and toast notifications (`sonner`). |

None of the packages ship a pre-built `dist` — they're consumed as raw TS/TSX via `workspace:*` and compiled by each app's own Vite build.

## Tech stack

- **React 19** + **Vite 8**, **TypeScript**
- **@module-federation/vite** — micro-frontend wiring
- **TanStack Router** — routing (host)
- **TanStack Query v5** — server state / caching
- **Zustand** — client state (auth session, cart, navigation bridge)
- **Tailwind CSS 4**
- **axios** — HTTP client
- **Turborepo** + **pnpm workspaces** — monorepo orchestration
- **lucide-react** — icons, **sonner** — toasts, **dayjs** — date handling

## Running locally

**Prerequisites:** pnpm `10.33.0` (see `packageManager` in `package.json`), and the backend services you intend to exercise running locally (see table below).

```bash
pnpm install
pnpm dev          # starts all 4 apps in parallel (turbo --parallel)
```

- host → http://localhost:3000
- catalog → http://localhost:3001
- checkout → http://localhost:3002
- cart → http://localhost:3003

Each app also supports `vite dev` / `vite build` independently. Build script per app: `tsc -b && vite build`.

```bash
pnpm build        # builds all apps in dependency order → apps/*/dist/
pnpm preview       # serves production builds
```

### Environment variables

Each app reads its config from `.env.development` / `.env.production`. Defaults below match local dev; adjust per environment.

| Variable | Used by | Points to | Default |
|---|---|---|---|
| `VITE_CATALOG_REMOTE` | host | catalog's `remoteEntry.js` | `http://localhost:3001/remoteEntry.js` |
| `VITE_CHECKOUT_REMOTE` | host | checkout's `remoteEntry.js` | `http://localhost:3002/remoteEntry.js` |
| `VITE_CART_REMOTE` | host | cart's `remoteEntry.js` | `http://localhost:3003/remoteEntry.js` |
| `VITE_AUTH_BASE_URL` | host (`@ecomm/auth`) | Auth Service | `http://localhost:8081` |
| `VITE_GOOGLE_OAUTH_URL` | host | Auth Service Google OAuth entrypoint | `http://localhost:8081/oauth2/authorization/google` |
| `VITE_CART_BASE_API_URL` | host, checkout (`@ecomm/cart`) | Cart Service | `http://localhost:8085/` |
| `VITE_ORDERS_BASE_URL` | checkout (`@ecomm/orders`) | Ordering Service | `http://localhost:8086` |
| `VITE_PROFILE_BASE_URL` | `@ecomm/profile` | Profile Service | `http://localhost:8087` |
| `VITE_BASE_API_URL` | catalog | Product Service | `http://localhost:8082/` |

`VITE_AUTH_BASE_URL` has no built-in fallback and must be set for auth-dependent flows to work; `VITE_ORDERS_BASE_URL` and `VITE_PROFILE_BASE_URL` fall back to the ports above if unset.

## Known gaps

- Production `.env` files for catalog, checkout, and cart still hold placeholder values (`"should-be-deployed-url"`, `"cart-server-prod-url"`, etc.) rather than real deployed URLs.
- `apps/host/.env.production` doesn't set `VITE_AUTH_BASE_URL` / `VITE_GOOGLE_OAUTH_URL`.
