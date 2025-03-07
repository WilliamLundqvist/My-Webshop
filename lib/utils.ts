import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const cleanCategoryName = (name: string): string => {
  return name.includes("|") ? name.split("|")[0].trim() : name;
};

export const processCategories = (categoryData: any) => {
  if (!categoryData || !categoryData.productCategory || !categoryData.productCategory.children) {
    return [];
  }

  // First process all categories
  const processedCategories = categoryData.productCategory.children.nodes.map(
    (category) => {
      // Use utility function instead of duplicating logic
      const cleanParentName = cleanCategoryName(category.name);

      // Create a new object for each category
      const processedCategory = {
        id: category.id,
        name: cleanParentName,
        slug: category.slug,
        children: { nodes: [] },
      };

      // Process grandchildren if they exist
      if (category.children && category.children.nodes.length > 0) {
        // Keep track of names we've already seen to avoid duplicates
        const seenNames = new Set();

        // Filter grandchildren
        processedCategory.children.nodes = category.children.nodes
          .map((grandchild) => {
            // Use the same utility function here
            const cleanName = cleanCategoryName(grandchild.name);

            // Create a new object for the processed grandchild
            return {
              id: grandchild.id,
              name: cleanName,
              slug: grandchild.slug,
            };
          })
          .filter((grandchild) => {
            // Check if we've seen this name before
            if (seenNames.has(grandchild.name)) {
              return false; // Skip duplicates
            }

            // Add this name to our set of seen names
            seenNames.add(grandchild.name);
            return true;
          });
      }

      return processedCategory;
    }
  );

  // Now filter out categories that have no children after filtering
  return processedCategories.filter(
    (category) => category.children.nodes.length > 0
  );
};