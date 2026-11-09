'use client';

/** Opens the print dialog, which is also where browsers offer Save as PDF. */
export default function PrintButton() {
  return (
    <button
      type="button"
      className="button button-secondary button-compact resume-print-button"
      onClick={() => window.print()}
    >
      Print / PDF
    </button>
  );
}
