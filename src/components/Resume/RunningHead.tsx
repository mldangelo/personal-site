/**
 * The owner's name and the page number in the margins of a printed résumé's
 * later pages; the first page already opens with the name. Paper hides the
 * site header that carries it, and only an `@page` rule can fill a page
 * margin, so the rule renders with the résumé and leaves with it rather than
 * reaching every printed page. print.css sets the type.
 */
export default function RunningHead({ name }: { name: string }) {
  return (
    <style>
      {`@page{@top-left{content:${cssString(name)}}@bottom-right{content:counter(page) " / " counter(pages)}}` +
        '@page :first{@top-left{content:none}@bottom-right{content:none}}'}
    </style>
  );
}

/** `text` as a CSS string literal. */
function cssString(text: string): string {
  return `"${text.replace(/["\\]/g, '\\$&').replace(/[\n\r\f]/g, '\\a ')}"`;
}
