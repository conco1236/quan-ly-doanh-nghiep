import * as XLSX from "xlsx-js-style";

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

export type ExcelSheet = { name: string; headers: string[]; rows: ExportCell[][]; groupByColumn?: number };
export type AttendanceSummaryInput = { employeeId: number; workDate: Date | string; status: string };
export type LeaveSummaryInput = { employeeId: number; startDate: Date | string; totalDays: number | string; leaveType: string; status: string };
export type EmployeeSummaryPerson = { id: number; employeeCode?: string | null; fullName?: string | null; department?: string | null };

export const employeeMonthlySummaryHeaders = ["Nhân viên", "Mã nhân viên", "Phòng ban", "Tháng", "Tổng ngày công", "Có mặt", "Đi muộn", "Vắng", "Ngày lễ", "Nghỉ phép theo công", "Ngày nghỉ được duyệt", "Phép năm đã duyệt", "Ốm đã duyệt", "Không lương đã duyệt", "Khác đã duyệt", "Đơn chờ duyệt"];

function summaryMonth(value: Date | string) { const date = value instanceof Date ? value : new Date(value); return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`; }

export function buildEmployeeMonthlySummary(attendance: AttendanceSummaryInput[], leaves: LeaveSummaryInput[], people: EmployeeSummaryPerson[]): ExportCell[][] {
  const byKey = new Map<string, { employeeId: number; month: string; work: number; present: number; late: number; absent: number; holiday: number; attendanceLeave: number; approvedLeave: number; annual: number; sick: number; unpaid: number; other: number; pending: number }>();
  const ensure = (employeeId: number, month: string) => { const key = `${employeeId}|${month}`; if (!byKey.has(key)) byKey.set(key, { employeeId, month, work: 0, present: 0, late: 0, absent: 0, holiday: 0, attendanceLeave: 0, approvedLeave: 0, annual: 0, sick: 0, unpaid: 0, other: 0, pending: 0 }); return byKey.get(key)!; };
  for (const item of attendance) { const row = ensure(item.employeeId, summaryMonth(item.workDate)); row.work += 1; if (item.status === "present") row.present += 1; if (item.status === "late") row.late += 1; if (item.status === "absent") row.absent += 1; if (item.status === "holiday") row.holiday += 1; if (item.status === "leave") row.attendanceLeave += 1; }
  for (const item of leaves) { const row = ensure(item.employeeId, summaryMonth(item.startDate)); const days = Number(item.totalDays) || 0; if (item.status === "pending") row.pending += days; if (item.status === "approved") { row.approvedLeave += days; if (item.leaveType === "annual") row.annual += days; if (item.leaveType === "sick") row.sick += days; if (item.leaveType === "unpaid") row.unpaid += days; if (item.leaveType === "other") row.other += days; } }
  return Array.from(byKey.values()).sort((a, b) => { const departmentA = people.find(item => item.id === a.employeeId)?.department ?? "Chưa phân phòng ban"; const departmentB = people.find(item => item.id === b.employeeId)?.department ?? "Chưa phân phòng ban"; return departmentA.localeCompare(departmentB, "vi") || a.month.localeCompare(b.month) || a.employeeId - b.employeeId; }).map(row => { const person = people.find(item => item.id === row.employeeId); return [person?.fullName ?? `Nhân viên #${row.employeeId}`, person?.employeeCode ?? "", person?.department ?? "Chưa phân phòng ban", row.month, row.work, row.present, row.late, row.absent, row.holiday, row.attendanceLeave, row.approvedLeave, row.annual, row.sick, row.unpaid, row.other, row.pending]; });
}

const headerStyle = { font: { bold: true, color: { rgb: "FFFFFF" }, name: "Aptos" }, fill: { fgColor: { rgb: "102A43" } }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: { bottom: { style: "thin", color: { rgb: "D6A72D" } } } };
const bodyStyle = { font: { name: "Aptos", color: { rgb: "243B53" } }, alignment: { vertical: "center" } };
const totalStyle = { font: { bold: true, color: { rgb: "102A43" }, name: "Aptos" }, fill: { fgColor: { rgb: "FFF4CC" } }, alignment: { vertical: "center" }, border: { top: { style: "thin", color: { rgb: "D6A72D" } } } };
const subtotalStyle = { font: { bold: true, color: { rgb: "486581" }, name: "Aptos" }, fill: { fgColor: { rgb: "E6F0F7" } }, alignment: { vertical: "center" }, border: { top: { style: "thin", color: { rgb: "9FB3C8" } } } };
const isSummableHeader = (header: string) => /ngày công|số ngày|tổng ngày|có mặt|đi muộn|vắng|ngày lễ|nghỉ phép|phép năm|ốm|không lương|khác|đơn chờ|số giờ/i.test(header);
const isCountableHeader = (header: string) => /^ngày$/i.test(header);
function totalRowFor(sheet: ExcelSheet) { return sheet.headers.map((header, index) => index === 0 ? "Tổng cộng" : isSummableHeader(header) || isCountableHeader(header) ? null : ""); }

function cellDisplayValue(value: ExportCell) { return String(value ?? ""); }
function columnWidth(header: string, values: ExportCell[]) { const maxLength = Math.max(header.length, ...values.map(value => cellDisplayValue(value).length)); return Math.min(32, Math.max(10, maxLength + 2)); }
function applySheetFormatting(worksheet: any, sheet: ExcelSheet) {
  const totalRows = sheet.rows.length + 1;
  const totalColumns = sheet.headers.length;
  for (let column = 0; column < totalColumns; column += 1) {
    const header = sheet.headers[column];
    const columnValues = sheet.rows.map(row => row[column]);
    worksheet[`${XLSX.utils.encode_col(column)}1`].s = headerStyle;
    worksheet[`${XLSX.utils.encode_col(column)}1`].t = "s";
    for (let row = 2; row <= totalRows; row += 1) {
      const address = `${XLSX.utils.encode_col(column)}${row}`;
      if (!worksheet[address]) continue;
      const isSubtotal = typeof worksheet[address].v === "string" && worksheet[address].v.startsWith("Subtotal - ");
      worksheet[address].s = row === totalRows ? totalStyle : isSubtotal ? subtotalStyle : { ...bodyStyle, alignment: { ...bodyStyle.alignment, horizontal: typeof worksheet[address].v === "number" ? "right" : "left" } };
      if (/ngày|tháng/i.test(header)) worksheet[address].z = "dd/mm/yyyy";
      if (/số ngày|tổng ngày|có mặt|đi muộn|vắng|ngày lễ|nghỉ phép|đơn chờ|giờ/i.test(header) && typeof worksheet[address].v === "number") worksheet[address].z = Number.isInteger(worksheet[address].v) ? "0" : "0.00";
    }
  }
  worksheet["!cols"] = sheet.headers.map((header, index) => ({ wch: columnWidth(header, sheet.rows.map(row => row[index])) }));
  worksheet["!rows"] = [{ hpt: 30 }];
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft", state: "frozen" };
  worksheet["!autofilter"] = { ref: `A1:${XLSX.utils.encode_col(totalColumns - 1)}${totalRows}` };
}

export function buildXlsxWorkbook(sheets: ExcelSheet[]) {
  const workbook = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const groupedRows: ExportCell[][] = [];
    const subtotalRows: { row: number; start: number; end: number }[] = [];
    if (sheet.groupByColumn !== undefined) {
      let groupStart = 0;
      for (let index = 0; index < sheet.rows.length; index += 1) {
        const currentGroup = String(sheet.rows[index][sheet.groupByColumn] ?? "Chưa phân nhóm");
        const nextGroup = index + 1 < sheet.rows.length ? String(sheet.rows[index + 1][sheet.groupByColumn] ?? "Chưa phân nhóm") : null;
        groupedRows.push(sheet.rows[index]);
        if (nextGroup !== currentGroup) { const end = groupedRows.length - 1; groupedRows.push(sheet.headers.map((header, column) => column === 0 ? `Subtotal - ${currentGroup}` : isSummableHeader(header) || isCountableHeader(header) ? null : "")); subtotalRows.push({ row: groupedRows.length + 1, start: groupStart + 2, end: end + 2 }); groupStart = groupedRows.length; }
      }
    } else groupedRows.push(...sheet.rows);
    const total = totalRowFor(sheet);
    const rowsWithTotal = [...groupedRows, total];
    const formattedSheet = { ...sheet, rows: rowsWithTotal };
    const worksheet = XLSX.utils.aoa_to_sheet([sheet.headers, ...rowsWithTotal]);
    applySheetFormatting(worksheet, formattedSheet);
    const totalRowNumber = rowsWithTotal.length + 1;
    sheet.headers.forEach((header, column) => {
      if (!isSummableHeader(header) && !isCountableHeader(header)) return;
      const address = `${XLSX.utils.encode_col(column)}${totalRowNumber}`;
      const firstDataRow = 2;
      const lastDataRow = totalRowNumber - 1;
      const range = `${XLSX.utils.encode_col(column)}${firstDataRow}:${XLSX.utils.encode_col(column)}${lastDataRow}`;
      for (const subtotal of subtotalRows) {
        const subtotalAddress = `${XLSX.utils.encode_col(column)}${subtotal.row}`;
        const subtotalRange = `${XLSX.utils.encode_col(column)}${subtotal.start}:${XLSX.utils.encode_col(column)}${subtotal.end}`;
        worksheet[subtotalAddress] = { t: "n", v: 0, f: `${isCountableHeader(header) ? "COUNTA" : "SUM"}(${subtotalRange})`, s: subtotalStyle, z: isSummableHeader(header) ? "0.00" : "0" };
      }
      const totalFormula = subtotalRows.length ? `SUM(${subtotalRows.map(subtotal => `${XLSX.utils.encode_col(column)}${subtotal.row}`).join(",")})` : lastDataRow >= firstDataRow ? `${isCountableHeader(header) ? "COUNTA" : "SUM"}(${range})` : "0";
      worksheet[address] = { t: "n", v: 0, f: totalFormula, s: totalStyle, z: isSummableHeader(header) ? "0.00" : "0" };
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31));
  }
  return workbook;
}

export function downloadXlsx(filename: string, sheets: ExcelSheet[]) {
  const workbook = buildXlsxWorkbook(sheets);
  const content = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(content, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}
