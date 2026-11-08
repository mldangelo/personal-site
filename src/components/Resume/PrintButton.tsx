'use client';

/** Opens the print dialog, which is also where browsers offer Save as PDF. */
export default function PrintButton() {
  return (
    <button
      type="button"
      className="resume-print-button"
      onClick={() => window.print()}
    >
      Print / PDF
    </button>
  );
}
