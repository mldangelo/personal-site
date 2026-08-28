/**
 * The profile fields the share card actually renders.
 *
 * `generate-og.mjs` folds this into the digest it commits alongside the image,
 * and `check-og.mjs` recomputes it to decide whether the committed card has
 * gone stale. Both must agree on the field list or the check quietly stops
 * covering whichever field only one of them knows about — so the list lives
 * here once rather than being copied into each script.
 *
 * Adding a field here is what makes a change to that field invalidate the card.
 */
export function ogProfileSnapshot(profile) {
  return {
    name: profile.name,
    employer: profile.employer,
    focus: profile.focus,
  };
}
