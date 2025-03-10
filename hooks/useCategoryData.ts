import { useState, useEffect, useRef, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION } from '@/lib/graphql/queries';
import { processCategories } from '@/lib/utils';

/**
 * Custom hook to fetch and process category data with localStorage caching
 */
export function useCategoryData(section: string) {
  // Use refs to track if we've already fetched to avoid duplicate requests in StrictMode
  const hasFetchedRef = useRef(false);
  const sectionRef = useRef(section);
  const isMountedRef = useRef(true);

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debugging only - can be removed in production
  const rerenders = useRef(0);
  rerenders.current++;
  console.log(`Rerenders: ${rerenders.current}`);

  // Get Apollo client instance directly
  const client = useApolloClient();

  // Update section ref when it changes
  useEffect(() => {
    sectionRef.current = section;
  }, [section]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch and process categories - only run once per section
  useEffect(() => {
    // Skip if already fetched this section to avoid StrictMode double fetching
    if (hasFetchedRef.current && sectionRef.current === section) {
      console.log(`Skipping duplicate fetch for section: ${section}`);
      return;
    }

    console.log(`Effect running for section: ${section}`);
    // Create a cache key for this section
    const cacheKey = `category_data_${section || 'default'}`;

    // If no section, just set empty data instead of returning early
    if (!section) {
      setCategoryData(null);
      setLoading(false);
      return;
    }

    // Skip fetching if we're already loading
    if (loading) return;

    // Check if we have data in localStorage
    if (typeof window !== 'undefined') {
      try {
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          console.log(`Using cached data for section: ${section}`);
          setCategoryData(JSON.parse(cachedData));
          setLoading(false);
          hasFetchedRef.current = true;
          return;
        }
      } catch (err) {
        console.error("Error reading from localStorage:", err);
      }
    }

    console.log(`Fetching data for section: ${section}`);

    // Start loading
    setLoading(true);
    setError(null);
    hasFetchedRef.current = true;

    // Manual query execution
    client.query({
      query: GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION,
      variables: { section },
      fetchPolicy: "network-only",
    })
      .then((result) => {
        // Check if component is still mounted
        if (!isMountedRef.current) return;

        setCategoryData(result.data);
        setLoading(false);

        // Store in localStorage for future visits
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(result.data));
          } catch (err) {
            console.error("Error saving to localStorage:", err);
          }
        }
      })
      .catch((err) => {
        // Check if component is still mounted
        if (!isMountedRef.current) return;

        console.error("Error fetching categories:", err);
        setError(err);
        setLoading(false);
      });
  }, [section, client, loading]);

  // Process the categories - memoize to prevent recalculation on every render
  const processedCategories = useMemo(() => {
    return categoryData ? processCategories(categoryData) : [];
  }, [categoryData]);

  // Memoize the return object to prevent reference changes
  return useMemo(() => ({
    categories: processedCategories,
    loading,
    error
  }), [processedCategories, loading, error]);
} 