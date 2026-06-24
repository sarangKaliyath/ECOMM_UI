# Catalog App — Architecture Context

## Role
Remote micro-frontend. Exposes `./CatalogApp` via Module Federation. Consumed by the host shell at `http://localhost:3001/remoteEntry.js`.

**Port:** 3001 (dev + preview)

---

## Entry Chain
```
main.tsx
 └─ bootstrap.tsx        ← Module Federation entry point (what host imports)
     └─ QueryClientProvider
         └─ App.tsx      ← layout shell
             ├─ Filters  (container)
             └─ Products (container)
```

`bootstrap.tsx` is the only file exposed to the host. It wraps `App` in `QueryClientProvider` so React Query is scoped to this remote.

---

## Directory Structure
```
src/
├── bootstrap.tsx              MF entry — wraps App in QueryClientProvider
├── App.tsx                    Layout: filter sidebar + product grid
│
├── api/
│   └── products.api.ts        Raw axios calls — one function per endpoint
│
├── queries/
│   └── product/
│       ├── productKeys.ts     React Query key factory
│       └── productQueries.ts  queryOptions definitions (staleTime etc.)
│
├── hooks/
│   └── useProducts.ts         Thin wrapper: useQuery(productQueries.list())
│
├── containers/
│   ├── products/
│   │   └── products.tsx       Data-aware — calls useProducts, owns sort state
│   └── filters/
│       └── filters.tsx        UI-only — owns filter state locally (not yet wired)
│
├── common/
│   └── card/
│       ├── index.tsx          Presentational product card
│       └── CardSkeleton.tsx   Loading skeleton
│
├── types/
│   ├── product.ts             Product, Category interfaces
│   └── card.ts                CardType (props for Card component)
│
└── utils/
    └── dateHandlers/
        └── index.ts           isNewProduct(createdAt) — true if ≤ 15 days old
```

---

## Design Patterns

### 1. API → Query → Hook → Container layering
Each data domain follows this strict chain — never skip layers:

```
api/           pure axios function, returns typed data
  ↓
queries/       queryOptions (key + queryFn + staleTime) — no component code
  ↓
hooks/         useQuery(queryOptions) — one hook per query
  ↓
containers/    calls hook, owns derived state (sort, filter), renders UI
  ↓
common/        presentational components — no data fetching, props only
```

**Example (products):**
```
api/products.api.ts        getAllProducts() → Product[]
queries/product/
  productKeys.ts           { all, lists }
  productQueries.ts        productQueries.list() → queryOptions
hooks/useProducts.ts       useProducts() → useQuery(productQueries.list())
containers/products/       useProducts() + sort state → renders Card grid
common/card/               receives { name, price, imageUrl, createdAt } as props
```

### 2. Containers vs Common components
- **containers/**: know about data, React Query hooks, and app state. One container per feature section.
- **common/**: purely presentational — only receive props, no hooks beyond `useState`. Reusable across the app.

### 3. Query key factory pattern
```ts
// queries/product/productKeys.ts
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
}
```
Always extend the factory when adding new queries for the same domain.

### 4. Types location
- `types/product.ts` — domain model (matches API response shape)
- `types/card.ts` — component prop types (what UI needs, subset of domain model)
- Keep domain types and component prop types separate

### 5. Responsive layout
- Mobile-first Tailwind classes
- Filter sidebar: drawer on mobile (translate-x), static on `md+`
- Product grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
- Backdrops and overlays use `fixed inset-0 z-40 md:hidden`

### 6. Loading / Error states
Containers handle all async states — never push loading/error into common components:
```
isPending → render skeleton array (e.g. Array.from({ length: 10 }).map(...))
isError   → render error UI with message
data      → render real UI
```

---

## API
| Endpoint | Method | Base URL | Returns |
|----------|--------|----------|---------|
| `/product` | GET | `http://localhost:8082` | `Product[]` |

URL is currently hardcoded in `api/products.api.ts`. Move to an env variable when adding a production backend.

---

## State
| State | Location | Tool |
|-------|----------|------|
| Products data + cache | React Query (bootstrap scope) | `useProducts` hook |
| Sort selection | `containers/products/products.tsx` | `useState` |
| Filter values | `containers/filters/filters.tsx` | `useState` |
| Card quantity | `common/card/index.tsx` | `useState` |

Filter state is not yet connected to the product list — this is a known gap.

---

## Known Gaps
- [ ] Filters not wired to product list — filter state lives only inside `Filters` component
- [ ] Cart quantity is local state only — not persisted or shared
- [ ] API base URL hardcoded (`localhost:8082`) — needs env variable
- [ ] No product detail route/page
