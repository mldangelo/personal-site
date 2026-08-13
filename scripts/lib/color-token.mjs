const CUSTOM_PROPERTY = /^--[a-z0-9-]+$/;
const LITERAL_HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/**
 * Reads one literal hex custom property from stylesheet source.
 *
 * This is deliberately small and independent of the filesystem so generators
 * can reject invalid CSS values before they write any output.
 */
export function readLiteralColorToken(css, name, source = 'stylesheet') {
  if (!CUSTOM_PROPERTY.test(name)) {
    throw new Error(`Not a custom property name: ${name}`);
  }

  const declaration = new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm').exec(css);
  if (!declaration) {
    throw new Error(`${name} is not declared in ${source}`);
  }

  const value = declaration[1].trim();
  if (!LITERAL_HEX.test(value)) {
    throw new Error(
      `${name} in ${source} is "${value}", which is not a literal hex colour.`,
    );
  }

  return value.toLowerCase();
}
