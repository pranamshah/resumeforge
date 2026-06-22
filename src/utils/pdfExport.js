import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const A4_WIDTH_PX = 794; // 210mm at 96dpi — guarantees correct page proportions

export const exportResumeToPDF = async (element, resumeData, company) => {
  if (!element) throw new Error('Preview element not found');

  // Clone the live preview at a fixed A4 width so the PDF matches the
  // on-screen preview exactly, with correct proportions (no narrow render).
  const clone = element.cloneNode(true);
  clone.querySelectorAll('.preview-badge').forEach(b => b.remove());
  Object.assign(clone.style, {
    width: `${A4_WIDTH_PX}px`,
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
    width: `${A4_WIDTH_PX}px`,
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
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
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
