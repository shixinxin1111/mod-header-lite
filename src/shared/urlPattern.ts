export function urlToOriginRegexPattern(url: string | undefined) {
  if (!url) {
    return '';
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return '';
    }
  } catch {
    return '';
  }

  const escapedOrigin = parsedUrl.origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return `^${escapedOrigin}/.*$`;
}
