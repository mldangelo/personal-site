export interface IPdf {
  data: {
    path: string;
  };
  title?: string;
}

// Uses the browser's built-in PDF viewer. The previous react-pdf /
// @react-pdf-viewer stack pulled in a second copy of pdfjs-dist and crashed on
// load ("Object.defineProperty called on non-object").
const PdfViewer = ({ data, title }: IPdf) => {
  const src = data.path.startsWith('/') ? data.path : `/${data.path}`;

  return (
    <object data={src} type="application/pdf" className="h-full w-full">
      <div className="p-5 text-[0.92rem] text-muted">
        <p>Your browser can&apos;t display this PDF inline.</p>
        <a
          href={src}
          className="mt-2 inline-block font-mono text-[0.8rem] text-accent hover:underline"
        >
          Open {title ?? 'the PDF'} →
        </a>
      </div>
    </object>
  );
};

export default PdfViewer;
