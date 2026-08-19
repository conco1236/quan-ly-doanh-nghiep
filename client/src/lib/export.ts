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
export type AttendanceSummaryInput = { employeeId: number; workDate: Date | string; status: string };
export type LeaveSummaryInput = { employeeId: number; startDate: Date | string; totalDays: number | string; leaveType: string; status: string };
export type EmployeeSummaryPerson = { id: number; employeeCode?: string | null; fullName?: string | null };

export const employeeMonthlySummaryHeaders = ["Nhân viên", "Mã nhân viên", "Tháng", "Tổng ngày công", "Có mặt", "Đi muộn", "Vắng", "Ngày lễ", "Nghỉ phép theo công", "Ngày nghỉ được duyệt", "Phép năm đã duyệt", "Ốm đã duyệt", "Không lương đã duyệt", "Khác đã duyệt", "Đơn chờ duyệt"];

function summaryMonth(value: Date | string) { const date = value instanceof Date ? value : new Date(value); return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`; }

export function buildEmployeeMonthlySummary(attendance: AttendanceSummaryInput[], leaves: LeaveSummaryInput[], people: EmployeeSummaryPerson[]): ExportCell[][] {
  const byKey = new Map<string, { employeeId: number; month: string; work: number; present: number; late: number; absent: number; holiday: number; attendanceLeave: number; approvedLeave: number; annual: number; sick: number; unpaid: number; other: number; pending: number }>();
  const ensure = (employeeId: number, month: string) => { const key = `${employeeId}|${month}`; if (!byKey.has(key)) byKey.set(key, { employeeId, month, work: 0, present: 0, late: 0, absent: 0, holiday: 0, attendanceLeave: 0, approvedLeave: 0, annual: 0, sick: 0, unpaid: 0, other: 0, pending: 0 }); return byKey.get(key)!; };
  for (const item of attendance) { const row = ensure(item.employeeId, summaryMonth(item.workDate)); row.work += 1; if (item.status === "present") row.present += 1; if (item.status === "late") row.late += 1; if (item.status === "absent") row.absent += 1; if (item.status === "holiday") row.holiday += 1; if (item.status === "leave") row.attendanceLeave += 1; }
  for (const item of leaves) { const row = ensure(item.employeeId, summaryMonth(item.startDate)); const days = Number(item.totalDays) || 0; if (item.status === "pending") row.pending += days; if (item.status === "approved") { row.approvedLeave += days; if (item.leaveType === "annual") row.annual += days; if (item.leaveType === "sick") row.sick += days; if (item.leaveType === "unpaid") row.unpaid += days; if (item.leaveType === "other") row.other += days; } }
  return Array.from(byKey.values()).sort((a, b) => a.month.localeCompare(b.month) || a.employeeId - b.employeeId).map(row => { const person = people.find(item => item.id === row.employeeId); return [person?.fullName ?? `Nhân viên #${row.employeeId}`, person?.employeeCode ?? "", row.month, row.work, row.present, row.late, row.absent, row.holiday, row.attendanceLeave, row.approvedLeave, row.annual, row.sick, row.unpaid, row.other, row.pending]; });
}

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
