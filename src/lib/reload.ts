/**
 * A full load of the current address. A module of its own so a test can stand
 * in for it: jsdom can neither navigate nor let `location.reload` be replaced.
 */
export function reloadPage(): void {
  window.location.reload();
}
