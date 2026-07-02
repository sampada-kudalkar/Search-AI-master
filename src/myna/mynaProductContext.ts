// mynaProductContext.ts
// Product-specific context definitions for the Myna AI assistant

import type { MynaProductContextMap } from "./mynaSemanticTypes";

export const PRODUCT_CONTEXTS: MynaProductContextMap = {
  "Listings": {
    description: "Manage and sync your business listings across 50+ directories to improve local search visibility.",
    dataSnapshot: {
      totalListings: 52,
      syncedListings: 48,
      pendingUpdates: 4,
      overallScore: "91%"
    },
    quickActions: [
      "Why are my listings out of sync?",
      "Which directories matter most?",
      "How do I improve my listing score?"
    ]
  },
  "Reviews": {
    description: "Monitor and respond to customer reviews across Google, Facebook, Yelp, and 200+ other platforms.",
    dataSnapshot: {
      averageRating: "4.3",
      totalReviews: 1284,
      responseRate: "78%",
      pendingResponses: 23
    },
    quickActions: [
      "How do I respond to negative reviews?",
      "What's my review trend this month?",
      "Which platform needs the most attention?"
    ]
  },
  "Search AI": {
    description: "AI-powered competitor analysis — tracks visibility, citation share, and keyword rankings across ChatGPT, Gemini, Perplexity, and Claude.",
    dataSnapshot: {
      visibilityScore: "62%",
      citationShare: "18%",
      topKeyword: "dental implants near me",
      trackedCompetitors: 8,
      platforms: ["ChatGPT", "Gemini", "Perplexity", "Claude"]
    },
    quickActions: [
      "Why is my visibility dropping?",
      "Which competitor is gaining on me?",
      "What topics should I focus on?"
    ]
  }
};

export function getProductContext(productName: string) {
  return PRODUCT_CONTEXTS[productName] ?? null;
}
