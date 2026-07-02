// mynaL2NavKeys.ts
// L2 navigation key constants for context-aware AI routing

export const MYNA_L2_NAV_KEYS = {
  SEARCH_AI: "Search AI",
  LISTINGS: "Listings",
  REVIEWS: "Reviews",
  SOCIAL: "Social",
  CAMPAIGNS: "Campaigns",
  INSIGHTS: "Insights",
  MESSAGING: "Messaging",
  REFERRALS: "Referrals",
} as const;

export type MynaL2NavKey = (typeof MYNA_L2_NAV_KEYS)[keyof typeof MYNA_L2_NAV_KEYS];

export function isValidL2NavKey(key: string): key is MynaL2NavKey {
  return Object.values(MYNA_L2_NAV_KEYS).includes(key as MynaL2NavKey);
}
