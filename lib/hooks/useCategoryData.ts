import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useApolloClient } from "@apollo/client";
import { GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION } from "@/lib/graphql/queries";
import { processCategories } from "@/lib/utils/utils";
import { useIsMounted } from "./useIsMounted";

/**
 * Custom hook to fetch and process category data with localStorage caching
 */
export function useCategoryData(section: string) {
  // Use refs to track if we've already fetched to avoid duplicate requests in StrictMode
  const hasFetchedRef = useRef(false);
  const prevSectionRef = useRef(section);
  const isMountedRef = useIsMounted();

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get Apollo client instance directly
  const client = useApolloClient();

  // Reset hasFetched when section changes
  useEffect(() => {
    if (prevSectionRef.current !== section) {
      hasFetchedRef.current = false;
      prevSectionRef.current = section;
    }
  }, [section]);

  // Memoize the fetch function to prevent recreating it on each render
  const fetchCategories = useCallback(async () => {
    // Skip if already fetched this section to avoid StrictMode double fetching
    if (hasFetchedRef.current) {
      return;
    }

    // Create a cache key for this section
    const cacheKey = `category_data_${section || "default"}`;

    // If no section, just set empty data instead of returning early
    if (!section) {
      setCategoryData(null);
      setLoading(false);
      return;
    }

    // Skip fetching if we're already loading
    if (loading) return;

    // Check if we have data in localStorage and it's for the current section
    if (typeof window !== "undefined") {
      try {
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          setCategoryData(JSON.parse(cachedData));
          setLoading(false);
          hasFetchedRef.current = true;
          return;
        }
      } catch (err) {
        console.error("Error reading from localStorage:", err);
      }
    }

    // Start loading
    setLoading(true);
    setError(null);
    hasFetchedRef.current = true;

    try {
      // Manual query execution
      const result = await client.query({
        query: GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION,
        variables: { section },
        fetchPolicy: "network-only",
      });

      // Check if component is still mounted
      if (!isMountedRef.current) return;

      setCategoryData(result.data);
      setLoading(false);

      // Store in localStorage for future visits
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(result.data));
        } catch (err) {
          console.error("Error saving to localStorage:", err);
        }
      }
    } catch (err) {
      // Check if component is still mounted
      if (!isMountedRef.current) return;

      console.error("Error fetching categories:", err);
      setError(err);
      setLoading(false);
    }
  }, [section, client, loading, isMountedRef]);

  // Fetch and process categories
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Process the categories - memoize to prevent recalculation on every render
  const processedCategories = useMemo(() => {
    return categoryData ? processCategories(categoryData) : [];
  }, [categoryData]);

  // Memoize the return object to prevent reference changes
  return useMemo(
    () => ({
      categories: processedCategories,
      loading,
      error,
    }),
    [processedCategories, loading, error]
  );
}
