/**
 * Utility functions for managing application cache
 */

/**
 * Clears all application cache data from localStorage
 * @returns {boolean} Success status
 */
export const clearAllCache = (): boolean => {
  try {
    // List of all storage keys used in the application
    const storageKeys = [
      'crm_quotes',
      'crm_invoices', 
      'crm_services',
      'crm_bon_livraisons',
      'crm_events',
      'racha_document_counters'
    ];
    
    // Clear each storage item
    storageKeys.forEach(key => localStorage.removeItem(key));
    
    console.info('Application cache cleared successfully');
    return true;
  } catch (error) {
    console.error('Failed to clear application cache:', error);
    return false;
  }
};

/**
 * Clears specific cache data by key
 * @param {string} key The storage key to clear
 * @returns {boolean} Success status
 */
export const clearCacheByKey = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    console.info(`Cache cleared for: ${key}`);
    return true;
  } catch (error) {
    console.error(`Failed to clear cache for ${key}:`, error);
    return false;
  }
};