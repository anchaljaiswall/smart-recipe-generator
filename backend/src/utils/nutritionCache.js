// utils/nutritionCache.js
const cache = new Map();

export function getFromCache(key) {
  return cache.get(key);
}

export function saveToCache(key, value) {
  cache.set(key, value);
}
