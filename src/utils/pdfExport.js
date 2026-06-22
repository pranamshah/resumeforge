import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportResumeToPDF = async (element, resumeData, company) => {
  if (!element) throw new Error('Preview element not found');

  // Temporarily hide the preview badge so it doesn't appear in PDF
  const badge = element.querySelector('.preview-badge');
  if (badge) badge.style.display = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 1.8,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * pageW) / canvas.width;

    if (imgH <= pageH) {
      // Fits on one page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgW, imgH);
    } else {
      // Multi-page: slice image per A4 page
      let yOffset = 0;
      let pageNum = 0;
      while (yOffset < canvas.height) {
        if (pageNum > 0) pdf.addPage();
        const sliceH = Math.min(canvas.height - yOffset, (pageH * canvas.width) / pageW);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        sliceCanvas.getContext('2d').drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageW, (sliceH * pageW) / canvas.width);
        yOffset += sliceH;
        pageNum++;
      }
    }

    const firstName = (resumeData?.personal?.name || 'Resume').split(' ')[0];
    const co = (company || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`${firstName}_${co}_Resume.pdf`);
  } finally {
    if (badge) badge.style.display = '';
  }
};
