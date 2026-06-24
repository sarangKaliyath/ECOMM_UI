# Checkout App — Architecture Context

## Role
Remote micro-frontend for the checkout flow. Exposes `./CheckoutApp` via Module Federation. Consumed by the host shell.

**Port:** 3002 (dev + preview)  
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
├── App.tsx                    Layout shell / step router for this remote
│
├── api/
│   └── checkout.api.ts        Raw axios/fetch calls — typed return values
│   └── orders.api.ts
│
├── queries/                   (if using React Query)
│   └── checkout/
│       ├── checkoutKeys.ts    React Query key factory
│       └── checkoutQueries.ts queryOptions / mutationOptions
│
├── hooks/
│   └── useCheckout.ts         Thin hook wrappers over queries/mutations
│
├── containers/
│   ├── orderSummary/          Data-aware container — shows cart items + totals
│   ├── addressForm/           Form container — owns form state
│   └── payment/               Payment step container
│
├── common/                    Presentational components (props only, no hooks)
│   ├── orderItem/
│   └── priceBreakdown/
│
├── types/
│   ├── order.ts               Order, OrderItem interfaces
│   └── address.ts             Address type
│
└── utils/
    └── pricing/               Price calculation helpers (tax, discount, total)
```

### Layer rules
```
api/         → pure data fetching, returns typed data, no React
queries/     → queryOptions / mutationOptions (key + fn + config)
hooks/       → useQuery / useMutation wrappers, one per operation
containers/  → calls hooks, owns form/step state, renders layout
common/      → presentational only, reusable, no data fetching
```

### bootstrap.tsx pattern
```tsx
// Wrap App in any providers this remote needs (React Query, context, etc.)
const CheckoutApp = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
export default CheckoutApp;
```

### Multi-step flow pattern
Checkout typically involves multiple steps (address → payment → confirmation). Manage step state at `App.tsx` level and pass step controls down to containers:
```tsx
// App.tsx
const [step, setStep] = useState<"address" | "payment" | "confirmation">("address");
```
Do not use a router for step transitions unless the steps need deep-linkable URLs.

### State considerations
Checkout needs cart data (items, quantities, totals). Options:
- Receive cart data as props if host orchestrates it
- Fetch cart from backend on mount
- Subscribe to shared cart state (same solution as cart app)

---

## Known Gaps / TODO
- [ ] Implement multi-step checkout UI (address → payment → confirmation)
- [ ] API integration for order creation
- [ ] Receive/fetch cart data to build order summary
- [ ] Form validation for address and payment fields
- [ ] Activate the remote in host's `App.tsx` (currently commented out)
