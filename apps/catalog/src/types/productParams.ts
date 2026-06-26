export interface ProductListParams {
  page?: number;
  size?: number;
  category?: number;
  min_price?: number;
  max_price?: number;
  rating?: number;
  in_stock?: boolean;
  on_sale?: boolean;
}
