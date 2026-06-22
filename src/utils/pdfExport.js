import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportResumeToPDF = async (element, resumeData, company) => {
  if (!element) throw new Error('Preview element not found');

  // Make sure web fonts (Inter etc.) are loaded — otherwise html2canvas
  // stalls/retries waiting for them, which is what caused the long hang.
  if (document.fonts?.ready) {
    try { await document.fonts.ready; } catch { /* ignore */ }
  }

  // Clone at the SAME width the preview is rendered at on screen so line
  // wrapping and spacing are identical to what the user sees. Strip the
  // badge / shadow / rounded corners that shouldn't be in the PDF.
  const width = element.offsetWidth;
  const clone = element.cloneNode(true);
  clone.querySelectorAll('.preview-badge').forEach(b => b.remove());
  Object.assign(clone.style, {
    width: `${width}px`,
    minHeight: 'auto',
    boxShadow: 'none',
    borderRadius: '0',
    margin: '0',
  });

  const holder = document.createElement('div');
  Object.assign(holder.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: `${width}px`,
    background: '#ffffff',
  });
  holder.appendChild(clone);
  document.body.appendChild(holder);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      removeContainer: true,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;

    if (imgH <= pageH + 1) {
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageW, imgH);
    } else {
      const pageSliceH = (pageH * canvas.width) / pageW; // source px per page
      let y = 0, page = 0;
      while (y < canvas.height) {
        if (page > 0) pdf.addPage();
        const sliceH = Math.min(pageSliceH, canvas.height - y);
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = sliceH;
        slice.getContext('2d').drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageW, (sliceH * pageW) / canvas.width);
        y += sliceH;
        page++;
      }
    }

    const firstName = (resumeData?.personal?.name || 'Resume').split(' ')[0];
    const co = (company || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`${firstName}_${co}_Resume.pdf`);
  } finally {
    document.body.removeChild(holder);
  }
};
