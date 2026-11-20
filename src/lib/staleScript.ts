/** Where the one reload after a failed script is recorded, per tab. */
const RELOAD_KEY = 'reloaded-after-missing-script';
/** Long enough to cover the reload itself, short enough to try again later. */
const RELOAD_WINDOW_MS = 10_000;

/**
 * A script or stylesheet chunk that failed to load. After a deploy, a page
 * that was already open asks for its own release's files, which are gone, and
 * a link it prefetched before the deploy fails when followed.
 */
export function isMissingScript(error: unknown): boolean {
  // Webpack's runtime names its error `ChunkLoadError` and always gives it
  // this message.
  return (
    error instanceof Error &&
    /Loading (?:CSS )?chunk \S+ failed|Failed to fetch dynamically imported module/i.test(
      error.message,
    )
  );
}

/**
 * Whether to reload `href` now, recording the attempt: once per address in a
 * short window, so a script that is missing from the new release too ends in
 * the error page rather than a reload loop. Without storage the loop could
 * not be stopped, so there is no reload.
 */
export function claimReload(href: string, now = Date.now()): boolean {
  try {
    const last = JSON.parse(
      window.sessionStorage.getItem(RELOAD_KEY) ?? 'null',
    ) as { href?: string; at?: number } | null;
    if (last?.href === href && now - (last.at ?? 0) < RELOAD_WINDOW_MS) {
      return false;
    }
    window.sessionStorage.setItem(
      RELOAD_KEY,
      JSON.stringify({ href, at: now }),
    );
    return true;
  } catch {
    return false;
  }
}
