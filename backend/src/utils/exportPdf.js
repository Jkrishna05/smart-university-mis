const PDFDocument = require('pdfkit');

/**
 * Export data to PDF
 * @param {Object} res - Express response object
 * @param {string} title - Document title
 * @param {Array} headers - Column headers
 * @param {Array} rows - Array of arrays containing row data
 * @param {string} fileName - Download file name
 */
const exportToPdf = (res, title, headers, rows, fileName = 'export') => {
  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);

  doc.pipe(res);

  // Title
  doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(1);

  // Table
  const colWidth = (doc.page.width - 60) / headers.length;
  const startX = 30;
  let y = doc.y;

  // Draw header
  doc.font('Helvetica-Bold').fontSize(9);
  doc.rect(startX, y, doc.page.width - 60, 20).fill('#4F46E5');
  doc.fillColor('#FFFFFF');
  headers.forEach((header, i) => {
    doc.text(header, startX + (i * colWidth) + 5, y + 5, {
      width: colWidth - 10,
      align: 'left'
    });
  });
  y += 20;
  doc.fillColor('#000000');

  // Draw rows
  doc.font('Helvetica').fontSize(8);
  rows.forEach((row, rowIndex) => {
    if (y > doc.page.height - 50) {
      doc.addPage();
      y = 30;
    }

    const bgColor = rowIndex % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
    doc.rect(startX, y, doc.page.width - 60, 18).fill(bgColor);
    doc.fillColor('#000000');

    row.forEach((cell, i) => {
      doc.text(String(cell || ''), startX + (i * colWidth) + 5, y + 4, {
        width: colWidth - 10,
        align: 'left'
      });
    });
    y += 18;
  });

  // Footer
  doc.fontSize(8).text(
    'University Management Information System',
    30,
    doc.page.height - 30,
    { align: 'center' }
  );

  doc.end();
};

module.exports = { exportToPdf };
