import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';

export interface IPdf {
  data: {
    path: string;
  };
}

const PdfViewer = (fileUrl: IPdf) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();
    }
  }, []);

  return (
    <div>
      {isClient && fileUrl ? (
        <Worker workerUrl={pdfjs.GlobalWorkerOptions.workerSrc}>
          <Viewer
            fileUrl={fileUrl.data.path}
            defaultScale={SpecialZoomLevel.PageFit}
          />
        </Worker>
      ) : (
        <div>Loading PDF...</div>
      )}
    </div>
  );
};
export default PdfViewer;
