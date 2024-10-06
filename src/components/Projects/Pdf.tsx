import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import React from 'react';

const PdfViewer = (path: string) => {
  return (
    <div style={{ height: '750px' }}>
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
      >
        <Viewer fileUrl={path} />
      </Worker>
    </div>
  );
};

export default PdfViewer;
