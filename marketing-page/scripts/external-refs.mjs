// Finds URLs the browser would fetch from another origin. <a href> is
// navigation, not a fetch, so plain links are allowed. So are <link rel="canonical"> and
// rel="alternate": they name a URL for crawlers, and the browser never requests them.

const REMOTE = /^(?:https?:)?\/\//i;
const HTML_FETCH_ATTR = /<(?:script|link|img|iframe|source|video|audio)\b[^>]*?\s(?:src|href)=["']([^"']+)["'][^>]*>/gi;
const NOT_FETCHED_LINK = /^<link\b[^>]*\srel=["'](?:canonical|alternate)["']/i;
const CSS_URL = /url\(\s*["']?([^"')\s]+)["']?\s*\)/gi;

/** @param {string} html @returns {string[]} */
export function findExternalRefs(html) {
  return [...html.matchAll(HTML_FETCH_ATTR)]
    .filter((m) => !NOT_FETCHED_LINK.test(m[0]))
    .map((m) => m[1])
    .filter((url) => REMOTE.test(url));
}

/** @param {string} css @returns {string[]} */
export function findExternalCssUrls(css) {
  return [...css.matchAll(CSS_URL)].map((m) => m[1]).filter((url) => REMOTE.test(url));
}
