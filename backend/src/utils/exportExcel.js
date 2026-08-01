const ExcelJS = require('exceljs');

/**
 * Export data to Excel spreadsheet
 * @param {Object} res - Express response object
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column definitions [{header, key, width}]
 * @param {string} sheetName - Name of the worksheet
 * @param {string} fileName - Download file name
 */
const exportToExcel = async (res, data, columns, sheetName = 'Sheet1', fileName = 'export') => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'University MIS';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.columns = columns;

  // Style header row
  worksheet.getRow(1).font = { bold: true, size: 12 };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F46E5' }
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Add data rows
  data.forEach(item => {
    const row = {};
    columns.forEach(col => {
      row[col.key] = item[col.key] || '';
    });
    worksheet.addRow(row);
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = Math.max(column.width || 15, 12);
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = { exportToExcel };
