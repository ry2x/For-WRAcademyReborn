import NodeCache from 'node-cache';

// Cache keys
export const CACHE_KEYS = {
  CHAMPION_DATA: 'champion_data',
  WIN_RATE_DATA: 'win_rate_data',
  NEWS_DATA: 'news_data',
} as const;

// Cache instance
const cache = new NodeCache({
  useClones: false, // Don't clone objects for better performance
  stdTTL: 0, // Disable TTL
  checkperiod: 0, // Disable periodic checks
});

/**
 * Get data from cache
 * @param key - Cache key
 * @returns Cached data or undefined if not found
 */
export function getCachedData<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

/**
 * Set data in cache
 * @param key - Cache key
 * @param data - Data to cache
 */
export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, data);
}

/**
 * Check if key exists in cache
 * @param key - Cache key
 * @returns True if key exists, false otherwise
 */
export function hasCache(key: string): boolean {
  return cache.has(key);
}

/**
 * Delete data from cache
 * @param key - Cache key
 * @returns True if key was found and deleted, false otherwise
 */
export function deleteCachedData(key: string): boolean {
  return cache.del(key) > 0;
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
  cache.flushAll();
}
