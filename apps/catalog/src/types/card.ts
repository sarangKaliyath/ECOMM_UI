export type CardType = {
    name: string,
    primaryImageUrl: string,
    defaultPrice: number,
    createdAt: string,
    currencyCode?: string,
    brand?: string,
    averageRating?: number,
    reviewCount?: number,
    inventoryStatus?: string,
    category?: { id: string | number; name: string },
    onSale?: boolean,
    discountRate?: number,
}