export function getVideoId(url: string): string | null {
  try {
    if (url.length === 11) return url;

    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}