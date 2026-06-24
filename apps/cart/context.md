# Cart App — Architecture Context

## Role
Remote micro-frontend for shopping cart management. Exposes `./CartApp` via Module Federation. Consumed by the host shell.

**Port:** 3003 (dev + preview)  
**Status:** Placeholder — not yet implemented.

---

## Entry Chain (current placeholder)
```
main.tsx
 └─ bootstrap.tsx    ← Module Federation entry point (what host imports)
     └─ App.tsx      ← blue placeholder UI
```

---

## Directory Structure (current)
```
src/
├── bootstrap.tsx    MF entry — re-exports App (add providers here as needed)
├── App.tsx          Placeholder component
├── main.tsx         Standalone dev entry
└── index.css        Tailwind globals
```

---

## Design Pattern to Follow (based on catalog)

When implementing this app, follow the same layered architecture used in the catalog app:

### Recommended directory structure
```
src/
├── bootstrap.tsx              MF entry — wrap App in any needed providers
├── App.tsx                    Layout shell for this remote
│
├── api/
│   └── cart.api.ts            Raw axios/fetch calls — typed return values
│
├── queries/                   (if using React Query)
│   └── cart/
│       ├── cartKeys.ts        React Query key factory
│       └── cartQueries.ts     queryOptions definitions
│
├── hooks/
│   └── useCart.ts             Thin hook wrappers over queries/mutations
│
├── containers/
│   └── cart/
│       └── cart.tsx           Data-aware — calls hooks, owns local UI state
│
├── common/                    Presentational components (props only, no hooks)
│   └── cartItem/
│       └── index.tsx
│
├── types/
│   └── cart.ts                Domain model types matching API response
│
└── utils/                     Pure helper functions (no side effects)
```

### Layer rules
```
api/         → pure data fetching, returns typed data, no React
queries/     → queryOptions / mutationOptions (key + fn + config)
hooks/       → useQuery / useMutation wrappers, one per operation
containers/  → calls hooks, owns derived/UI state, renders layout
common/      → presentational only, reusable, no data fetching
```

### bootstrap.tsx pattern
```tsx
// Wrap App in any providers this remote needs (React Query, context, etc.)
const CartApp = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
export default CartApp;
```

### State considerations
The cart app will likely need to share state with the host (cart item count for the Navbar badge). Options to implement:
- Expose a cart state context that the host can subscribe to via a second MF expose
- Use `window` custom events to broadcast cart updates
- Use a shared state solution (Zustand store in a shared package)

---

## Known Gaps / TODO
- [ ] Implement cart item listing UI
- [ ] API integration for cart CRUD
- [ ] Connect cart state to host Navbar badge
- [ ] Wire up "Add to Cart" from catalog's Card component
- [ ] Activate the remote in host's `App.tsx` (currently commented out)
