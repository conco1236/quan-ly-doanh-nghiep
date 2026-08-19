import * as XLSX from "xlsx";

export type ExportCell = string | number | null | undefined;

export function escapeCsvCell(value: ExportCell) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(headers: string[], rows: ExportCell[][]) {
  return [headers, ...rows].map(row => row.map(escapeCsvCell).join(",")).join("\r\n");
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, headers: string[], rows: ExportCell[][]) {
  downloadBlob(`\uFEFF${toCsv(headers, rows)}`, filename.endsWith(".csv") ? filename : `${filename}.csv`, "text/csv;charset=utf-8");
}

export function downloadExcel(filename: string, sheetName: string, headers: string[], rows: ExportCell[][]) {
  const cells = (row: ExportCell[]) => row.map(value => `<td>${String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")}</td>`).join("");
  const html = `<html><head><meta charset="utf-8" /></head><body><table><caption>${sheetName}</caption><thead><tr>${cells(headers)}</tr></thead><tbody>${rows.map(row => `<tr>${cells(row)}</tr>`).join("")}</tbody></table></body></html>`;
  downloadBlob(`\uFEFF${html}`, filename.endsWith(".xls") ? filename : `${filename}.xls`, "application/vnd.ms-excel;charset=utf-8");
}

export type ExcelSheet = { name: string; headers: string[]; rows: ExportCell[][] };

export function buildXlsxWorkbook(sheets: ExcelSheet[]) {
  const workbook = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const worksheet = XLSX.utils.aoa_to_sheet([sheet.headers, ...sheet.rows]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31));
  }
  return workbook;
}

export function downloadXlsx(filename: string, sheets: ExcelSheet[]) {
  const workbook = buildXlsxWorkbook(sheets);
  const content = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(content, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}
