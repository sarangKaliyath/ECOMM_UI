export const profileKeys = {
  all: ["profile"] as const,
  me: () => ["profile", "me"] as const,
  addresses: () => ["profile", "addresses"] as const,
};
