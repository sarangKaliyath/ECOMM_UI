import { ErrorBoundary } from "@ecomm/ui";
import ProductsInner from "./products";

const Products = (props: React.ComponentProps<typeof ProductsInner>) => (
  <ErrorBoundary name="Products">
    <ProductsInner {...props} />
  </ErrorBoundary>
);

export default Products;
