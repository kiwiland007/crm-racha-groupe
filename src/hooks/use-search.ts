import { useState, useMemo } from 'react';

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFn?: (item: T, searchTerm: string) => boolean;
}

interface UseSearchResult<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: T[];
  clearSearch: () => void;
  hasResults: boolean;
  resultCount: number;
}

export function useSearch<T>({
  data,
  searchFields,
  filterFn
}: UseSearchOptions<T>): UseSearchResult<T> {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase();

    return data.filter(item => {
      // Use custom filter function if provided
      if (filterFn) {
        return filterFn(item, lowercaseSearchTerm);
      }

      // Default search logic
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(lowercaseSearchTerm);
        }
        if (typeof fieldValue === 'number') {
          return fieldValue.toString().includes(lowercaseSearchTerm);
        }
        return false;
      });
    });
  }, [data, searchTerm, searchFields, filterFn]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
    hasResults: filteredData.length > 0,
    resultCount: filteredData.length
  };
}

// Hook spécialisé pour la recherche avec filtres multiples
interface UseAdvancedSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filters?: Record<string, unknown>;
  filterFunctions?: Record<string, (item: T, filterValue: unknown) => boolean>;
}

interface UseAdvancedSearchResult<T> extends UseSearchResult<T> {
  filters: Record<string, unknown>;
  setFilter: (key: string, value: unknown) => void;
  clearFilter: (key: string) => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
}

export function useAdvancedSearch<T>({
  data,
  searchFields,
  filters: initialFilters = {},
  filterFunctions = {}
}: UseAdvancedSearchOptions<T>): UseAdvancedSearchResult<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search term
    if (searchTerm.trim()) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const fieldValue = item[field];
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(lowercaseSearchTerm);
          }
          if (typeof fieldValue === 'number') {
            return fieldValue.toString().includes(lowercaseSearchTerm);
          }
          return false;
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "" && value !== "all") {
        if (filterFunctions[key]) {
          result = result.filter(item => filterFunctions[key](item, value));
        } else {
          // Default filter logic
          result = result.filter(item => {
            const itemValue = (item as Record<string, unknown>)[key];
            return itemValue === value;
          });
        }
      }
    });

    return result;
  }, [data, searchTerm, filters, searchFields, filterFunctions]);

  const setFilter = (key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const activeFilterCount = Object.values(filters).filter(
    value => value !== null && value !== undefined && value !== "" && value !== "all"
  ).length;

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
    hasResults: filteredData.length > 0,
    resultCount: filteredData.length,
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    activeFilterCount
  };
}
