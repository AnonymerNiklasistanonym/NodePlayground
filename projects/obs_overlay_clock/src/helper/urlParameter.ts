/**
 * Get a URL search parameter value by its key from the current URL
 * @param key Key of the URL search parameter
 * @returns The value if found or `null`
 */
export function getUrlParameter(key: string): null | string {
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Set (or delete) a URL search parameter by its key of the current URL
 * @param key Key of the URL search parameter
 * @param value If the value is `null` or `undefined` or empty remove the URL search paramter, otherwise update it
 */
export function updateUrlParameter(key: string, value?: string | null): void {
  const url = new URL(window.location.href);

  if (value && value.length > 0) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }

  // Update URL
  window.history.replaceState({}, "", url);
}
