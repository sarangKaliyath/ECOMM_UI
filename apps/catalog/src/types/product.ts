export interface Category {
  id: string | number;
  name: string;
  description: string;
}

export interface Product {
  id: string | number;
  name: string;
  description: string;
  shortDescription: string;
  defaultPrice: number;
  primaryImageUrl: string;
  currencyCode: string;
  brand: string;
  averageRating: number;
  reviewCount: number;
  inventoryStatus: string;
  category: Category;
  createdAt: string;
  created_at: string;
}
