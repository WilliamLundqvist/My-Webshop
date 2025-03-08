import { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION } from '@/lib/graphql/queries';
import { processCategories } from '@/lib/utils';



/**
 * Custom hook to fetch and process category data with localStorage caching
 */
export function useCategoryData(section: string) {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get Apollo client instance directly
  const client = useApolloClient();
  
  // Fetch and process categories
  useEffect(() => {
    // Skip if no section
    if (!section) return;
    
    // Create a cache key for this section
    const cacheKey = `category_data_${section}`;
    
    // Check if we have data in localStorage
    if (typeof window !== 'undefined') {
      try {
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
          console.log(`Using cached data for section: ${section}`);
          setCategoryData(JSON.parse(cachedData));
          setLoading(false);
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
    
    // Manual query execution
    client.query({
      query: GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION,
      variables: { section },
      fetchPolicy: "network-only",
    })
      .then((result) => {
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
        console.error("Error fetching categories:", err);
        setError(err);
        setLoading(false);
      });
  }, [section, client]);
  
  // Process the categories
  const processedCategories = categoryData ? processCategories(categoryData) : [];
  
  return {
    categories: processedCategories,
    loading,
    error
  };
} 