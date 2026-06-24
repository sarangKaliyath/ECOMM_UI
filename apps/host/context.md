# Host App — Architecture Context

## Role
Shell / container application. Loads and orchestrates all remote micro-frontends via Module Federation. The only app the end user navigates to directly.

**Port:** 3000 (dev + preview)

---

## Entry Chain
```
main.tsx
 └─ ErrorBoundary (@ecomm/ui)
     └─ App.tsx          layout shell
         ├─ Navbar        fixed top bar
         └─ <Suspense>
             └─ CatalogApp   (lazy, from remote)
             └─ CheckoutApp  (lazy, from remote) ← commented out
             └─ CartApp      (lazy, from remote) ← commented out
```

---

## Directory Structure
```
src/
├── main.tsx                  Entry — wraps App in top-level ErrorBoundary
├── App.tsx                   Shell layout — loads remotes with Suspense
│
├── components/
│   ├── index.tsx             Barrel export
│   └── Navbar/
│       ├── index.tsx         Barrel export
│       └── Navbar.tsx        Top navigation bar
│
└── remote.d.ts               TypeScript type shims for remote module imports
```

---

## Design Patterns

### 1. Remote loading pattern
All remotes follow the same pattern — lazy import wrapped in Suspense + ErrorBoundary:
```tsx
const CatalogApp = React.lazy(() => import("catalog/CatalogApp"));

<ErrorBoundary name="Catalog">
  <Suspense fallback={<div>Loading Catalog...</div>}>
    <CatalogApp />
  </Suspense>
</ErrorBoundary>
```
- Each remote gets its **own** `ErrorBoundary` so one failing remote doesn't crash the shell
- `name` prop on ErrorBoundary labels it in error logs

### 2. Remote type declarations (`remote.d.ts`)
TypeScript doesn't know about federated module paths by default. Declare them here:
```ts
declare module "catalog/CatalogApp" {
  const CatalogApp: React.ComponentType;
  export default CatalogApp;
}
```
Add a declaration for every new remote entry the host imports.

### 3. Host owns layout, remotes own content
The host provides the top-level layout (Navbar, page frame). Remotes should **not** render their own navbars or page-level chrome — they render only their content area.

### 4. Environment-based remote URLs
Remote entry points are never hardcoded in `vite.config.ts`. They come from `.env.*` files:
```
# .env.development
VITE_CATALOG_REMOTE=http://localhost:3001/remoteEntry.js

# .env.production
VITE_CATALOG_REMOTE=https://ecomm-ui-catalog-app.vercel.app/remoteEntry.js
```
Add both dev and production entries whenever a new remote is added.

### 5. Shared singletons
`react` and `react-dom` are declared as `singleton: true` in the host federation config. All remotes must declare them shared too — mismatched versions cause runtime errors.

---

## Components

### Navbar (`src/components/Navbar/Navbar.tsx`)
- Fixed top bar, black background
- Cart icon with badge (currently hardcoded to `0` — needs global cart state)
- Profile dropdown: Account / Settings / Login toggle (demo only, no real auth)
- Fully responsive (mobile hamburger menu ready)

---

## Remote Registry
| Remote | Federation name | Dev URL | Status |
|--------|----------------|---------|--------|
| Catalog | `catalog/CatalogApp` | `localhost:3001` | Active |
| Checkout | `checkout/CheckoutApp` | `localhost:3002` | Commented out |
| Cart | `cart/CartApp` | `localhost:3003` | Commented out |

---

## HMR Setup (dev only)
The `remoteHMRBridge([3001, 3002, 3003])` Vite plugin (`apply: "serve"`) injects a script into the host HTML that opens WebSocket connections to each remote's dev server. When a remote file changes, the host page auto-reloads. No production impact.

---

## Known Gaps
- [ ] Cart badge count hardcoded to `0` — needs global cart state shared from cart remote
- [ ] No real authentication — Navbar login is a local demo toggle
- [ ] CheckoutApp and CartApp remotes are commented out pending implementation
- [ ] No client-side routing — TanStack Router is installed but not configured
