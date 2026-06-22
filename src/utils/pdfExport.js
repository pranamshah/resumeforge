import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportResumeToPDF = async (resumeData, company) => {
  const el = document.getElementById('resume-export-target');
  if (!el) throw new Error('Export target not found');

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: 794,
    windowWidth: 794,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgH = (canvas.height * pageW) / canvas.width;

  let pos = 0;
  pdf.addImage(imgData, 'PNG', 0, pos, pageW, imgH);

  let heightLeft = imgH - pageH;
  while (heightLeft > 0) {
    pos -= pageH;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, pos, pageW, imgH);
    heightLeft -= pageH;
  }

  const firstName = (resumeData?.personal?.name || 'Resume').split(' ')[0];
  const co = (company || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`${firstName}_${co}_Resume.pdf`);
};
