/**
 * Dates as readers see them, shared by the site and the share-card generator
 * so a card prints a post's date exactly as its header does.
 */

/** A `YYYY-MM-DD` day at local noon, which no time zone offset moves to another day. */
const localNoon = (date) => new Date(`${date}T12:00:00`);

/**
 * `July 1, 2024`.
 * @param {string} date
 */
export function formatDate(date) {
  return localNoon(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * `Jul 2024`.
 * @param {string} date
 */
export function formatMonthYear(date) {
  return localNoon(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}
