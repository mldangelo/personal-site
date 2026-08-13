/**
 * Runtime validation shared by the site and the plain-Node asset scripts.
 *
 * Keeping this dependency-free lets both boundaries reject the same malformed
 * YAML before either a route or a generated public asset can be published.
 */
export function validatePostFrontmatterData(value, source = 'post') {
  if (!isRecord(value)) {
    throw frontmatterError(source, 'must be a YAML object');
  }

  const title = requiredText(value.title, 'title', source);
  const date = requiredText(value.date, 'date', source);
  const description = requiredText(value.description, 'description', source);

  if (!isCalendarDate(date)) {
    throw frontmatterError(
      source,
      '"date" must be a real calendar date in YYYY-MM-DD format',
    );
  }

  if (value.draft !== undefined && typeof value.draft !== 'boolean') {
    throw frontmatterError(source, '"draft" must be a boolean when provided');
  }

  const image =
    value.image === undefined
      ? undefined
      : requiredText(value.image, 'image', source);
  const imageAlt =
    value.imageAlt === undefined
      ? undefined
      : requiredText(value.imageAlt, 'imageAlt', source);

  if (image && (!image.startsWith('/') || image.startsWith('//'))) {
    throw frontmatterError(
      source,
      '"image" must be a root-relative path in public/',
    );
  }
  if (image && !imageAlt) {
    throw frontmatterError(
      source,
      '"imageAlt" is required when "image" is provided',
    );
  }
  if (imageAlt && !image) {
    throw frontmatterError(
      source,
      '"image" is required when "imageAlt" is provided',
    );
  }

  return {
    title,
    date,
    description,
    ...(value.draft === undefined ? {} : { draft: value.draft }),
    ...(image === undefined ? {} : { image }),
    ...(imageAlt === undefined ? {} : { imageAlt }),
  };
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(value, field, source) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw frontmatterError(source, `"${field}" must be a non-empty string`);
  }
  return value.trim();
}

function isCalendarDate(value) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parts) {
    return false;
  }

  const [, year, month, day] = parts;
  const parsed = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );
  return (
    parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() === Number(month) - 1 &&
    parsed.getUTCDate() === Number(day)
  );
}

function frontmatterError(source, message) {
  return new TypeError(`Invalid frontmatter in ${source}: ${message}`);
}
