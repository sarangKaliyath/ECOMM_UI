export const cartKeys = {
  all: ["cart"] as const,
  byType: (type: "USER" | "GUEST") => ["cart", type] as const,
  userCart: () => cartKeys.byType("USER"),
  guestCart: () => cartKeys.byType("GUEST"),
};
