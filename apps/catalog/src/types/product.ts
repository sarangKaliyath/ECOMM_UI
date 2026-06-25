export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
  primaryImageUrl: string;
  category: Category;
  created_at: string
}
