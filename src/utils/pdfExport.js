// Vector PDF export via the browser's native print engine.
// This renders the REAL resume DOM (crisp, selectable text — not a blurry
// raster screenshot), is instant (no html2canvas hang), and matches the
// preview exactly. The user picks "Save as PDF" in the print dialog.

export const exportResumeToPDF = async (element, resumeData, company) => {
  if (!element) throw new Error('Preview element not found');

  // Wait for web fonts so the print render uses the right typefaces.
  if (document.fonts?.ready) {
    try { await document.fonts.ready; } catch { /* ignore */ }
  }

  const clone = element.cloneNode(true);
  clone.querySelectorAll('.preview-badge').forEach(b => b.remove());
  Object.assign(clone.style, {
    boxShadow: 'none',
    borderRadius: '0',
    margin: '0',
    width: '100%',
    minHeight: 'auto',
    background: '#ffffff',
  });

  const firstName = (resumeData?.personal?.name || 'Resume').split(' ')[0];
  const co = (company || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
  const title = `${firstName}_${co}_Resume`;

  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'fixed', right: '0', bottom: '0',
    width: '0', height: '0', border: '0', visibility: 'hidden',
  });
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body { font-family: Inter, Arial, sans-serif; }
  /* Keep whole sections together; move to a new page rather than splitting */
  .resume-section { break-inside: avoid; page-break-inside: avoid; }
  /* Never orphan a section heading at the bottom of a page */
  .resume-section-header { break-after: avoid; page-break-after: avoid; }
  /* For sections too tall for one page, keep each entry intact */
  .resume-section > div { break-inside: avoid; page-break-inside: avoid; }
  ul, li { break-inside: avoid; page-break-inside: avoid; }
</style>
</head><body>${clone.outerHTML}</body></html>`);
  doc.close();

  // Wait for the iframe document (and its fonts) to be fully ready.
  await new Promise((resolve) => {
    const win = iframe.contentWindow;
    const ready = () => {
      const fontsReady = win.document.fonts?.ready || Promise.resolve();
      fontsReady.then(() => setTimeout(resolve, 200));
    };
    if (win.document.readyState === 'complete') ready();
    else win.addEventListener('load', ready);
  });

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  // Remove the iframe after the print dialog has been handled.
  setTimeout(() => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  }, 1500);
};
