import { InMemoryCache } from "@apollo/client";

// Skapa en delad cache-instans
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Om du behöver anpassa cache-hantering för specifika frågor
      },
    },
  },
});
