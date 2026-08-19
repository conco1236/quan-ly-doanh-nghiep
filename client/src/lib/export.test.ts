import { describe, expect, it } from "vitest";
import { escapeCsvCell, toCsv, buildDepartmentChartRows, buildHrAttendanceReportSheets, buildPosReconciliationSheets, buildXlsxWorkbook, buildEmployeeMonthlySummary, departmentsForPreset, filterByDepartments } from "./export";

describe("report export helpers", () => {
  it("escapes commas, quotes and line breaks in CSV cells", () => {
    expect(escapeCsvCell('Nguyễn, "Bảo"\nBáo')).toBe('"Nguyễn, ""Bảo""\nBáo"');
  });

  it("keeps header and row columns aligned", () => {
    expect(toCsv(["Nhân viên", "Số ngày"], [["Bảo Bảo", 2]])).toBe("Nhân viên,Số ngày\r\nBảo Bảo,2");
  });
});

describe("native XLSX workbook", () => {
  it("creates separate attendance and leave sheets", () => {
    const workbook = buildXlsxWorkbook([
      { name: "Cham cong", headers: ["Nhân viên", "Ngày"], rows: [["Bảo Bảo", "19/08/2026"]] },
      { name: "Nghi phep", headers: ["Nhân viên", "Số ngày"], rows: [["Bảo Bảo", 2]] },
    ]);
    expect(workbook.SheetNames).toEqual(["Cham cong", "Nghi phep"]);
    expect(workbook.Sheets["Cham cong"]["A1"].v).toBe("Nhân viên");
    expect(workbook.Sheets["Nghi phep"]["B2"].v).toBe(2);
    expect(workbook.Sheets["Cham cong"]["A1"].s.font.bold).toBe(true);
    expect(workbook.Sheets["Cham cong"]["!cols"][0].wch).toBeGreaterThan(10);
    expect(workbook.Sheets["Cham cong"]["!freeze"].ySplit).toBe(1);
    expect(workbook.Sheets["Nghi phep"]["B2"].z).toBe("0");
    expect(workbook.Sheets["Cham cong"]["A3"].v).toBe("Tổng cộng");
    expect(workbook.Sheets["Cham cong"]["B3"].f).toBe("COUNTA(B2:B2)");
    expect(workbook.Sheets["Cham cong"]["A3"].s.font.bold).toBe(true);
    expect(workbook.Sheets["Nghi phep"]["A3"].v).toBe("Tổng cộng");
  });
});

describe("POS and HR report workbooks", () => {
  it("builds POS reconciliation report with difference and counts", () => {
    const sheets = buildPosReconciliationSheets({ posRevenue: 1200000, reconciledRevenue: 1000000, difference: 200000, completedOrders: 12, linkedReceipts: 10 });
    expect(sheets[0].name).toBe("Doi soat POS");
    expect(sheets[0].rows[0]).toEqual(["Doanh thu POS hoàn tất", 1200000, "Tổng đơn có trạng thái hoàn thành"]);
    expect(sheets[0].rows[2][1]).toBe(200000);
    expect(buildXlsxWorkbook(sheets).Sheets["Doi soat POS"]["A8"].v).toBe("Tổng cộng");
  });
  it("builds HR sheets filtered by month with summary and chart", () => {
    const sheets = buildHrAttendanceReportSheets([{ employeeId: 1, workDate: "2026-08-01T00:00:00Z", status: "present" }, { employeeId: 1, workDate: "2026-09-01T00:00:00Z", status: "absent" }], [{ employeeId: 1, startDate: "2026-08-10T00:00:00Z", totalDays: 2, leaveType: "annual", status: "approved" }], [{ id: 1, employeeCode: "E01", fullName: "A", department: "Sản xuất" }], "2026-08");
    expect(sheets.map(sheet => sheet.name)).toEqual(["Cham cong", "Nghi phep", "Tong hop", "Bieu do"]);
    expect(sheets[0].rows).toHaveLength(1);
    expect(sheets[1].rows).toHaveLength(1);
    expect(sheets[2].rows[0][3]).toBe("2026-08");
    expect(sheets[3].rows[0][0]).toBe("Sản xuất");
  });
});

describe("department filters", () => {
  it("maps office and production presets to existing department names", () => {
    const departments = ["Hành chính", "Kế toán", "Nấu bia", "KCS / QC", "Kho nguyên liệu", "Không liên quan"];
    expect(departmentsForPreset("office", departments)).toEqual(["Hành chính", "Kế toán"]);
    expect(departmentsForPreset("production", departments)).toEqual(["Nấu bia", "KCS / QC", "Kho nguyên liệu"]);
    expect(departmentsForPreset("office", ["Bán hàng"])).toEqual(["Bán hàng"]);
  });
  const people = [{ id: 1, fullName: "A", department: "Kho" }, { id: 2, fullName: "B", department: "Sản xuất" }, { id: 3, fullName: "C", department: null }];
  const items = [{ employeeId: 1, value: "kho" }, { employeeId: 2, value: "sx" }, { employeeId: 3, value: "trống" }];
  it("filters selected departments and keeps all rows when no selection", () => {
    expect(filterByDepartments(items, people, ["Kho"]).map(item => item.value)).toEqual(["kho"]);
    expect(filterByDepartments(items, people, ["Chưa phân phòng ban"]).map(item => item.value)).toEqual(["trống"]);
    expect(filterByDepartments(items, people, []).length).toBe(3);
  });
});

describe("employee monthly summary", () => {
  it("groups attendance and leave data by employee and month", () => {
    const rows = buildEmployeeMonthlySummary(
      [
        { employeeId: 1, workDate: "2026-08-01T00:00:00Z", status: "present" },
        { employeeId: 1, workDate: "2026-08-02T00:00:00Z", status: "late" },
        { employeeId: 2, workDate: "2026-09-01T00:00:00Z", status: "absent" },
      ],
      [
        { employeeId: 1, startDate: "2026-08-10T00:00:00Z", totalDays: "2", leaveType: "annual", status: "approved" },
        { employeeId: 1, startDate: "2026-08-20T00:00:00Z", totalDays: 1, leaveType: "sick", status: "pending" },
      ],
      [{ id: 1, employeeCode: "E001", fullName: "Bảo Bảo", department: "Sản xuất" }, { id: 2, employeeCode: "E002", fullName: "Lan Lan", department: "Kho" }],
    );
    expect(rows).toEqual([
      ["Lan Lan", "E002", "Kho", "2026-09", 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      ["Bảo Bảo", "E001", "Sản xuất", "2026-08", 2, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 1],
    ]);
  });

  it("groups the summary sheet and creates department subtotals", () => {
    const workbook = buildXlsxWorkbook([{ name: "Tong hop", headers: ["Nhân viên", "Mã nhân viên", "Phòng ban", "Tháng", "Tổng ngày công"], rows: [["Lan Lan", "E002", "Kho", "2026-09", 1], ["Bảo Bảo", "E001", "Sản xuất", "2026-08", 2]], groupByColumn: 2 }]);
    const sheet = workbook.Sheets["Tong hop"];
    expect(sheet["A3"].v).toBe("Subtotal - Kho");
    expect(sheet["E3"].f).toBe("SUM(E2:E2)");
    expect(sheet["A5"].v).toBe("Subtotal - Sản xuất");
    expect(sheet["E5"].f).toBe("SUM(E4:E4)");
    expect(sheet["A6"].v).toBe("Tổng cộng");
    expect(sheet["E6"].f).toBe("SUM(E3,E5)");
    expect(sheet["A3"].s.font.bold).toBe(true);
  });

  it("builds department ratios and visual bars", () => {
    const rows = buildDepartmentChartRows([
      ["A", "E1", "Kho", "2026-08", 8, 8, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
      ["B", "E2", "Kho", "2026-08", 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    expect(rows[0].slice(0, 5)).toEqual(["Kho", 10, 2, 83.33, 16.67]);
    const workbook = buildXlsxWorkbook([{ name: "Bieu do", headers: ["Phòng ban", "Ngày công", "Ngày nghỉ phép", "Tỷ lệ ngày công (%)", "Tỷ lệ ngày nghỉ (%)", "Biểu đồ ngày công", "Biểu đồ ngày nghỉ"], rows, visualBarColumns: [{ sourceColumn: 3, targetColumn: 5, divisor: 5, color: "D6A72D" }, { sourceColumn: 4, targetColumn: 6, divisor: 5, color: "18B6C9" }] }]);
    expect(workbook.Sheets["Bieu do"]["A2"].v).toBe("Kho");
    expect(workbook.Sheets["Bieu do"]["F2"].v).toContain("█");
    expect(workbook.Sheets["Bieu do"]["F2"].f).toContain("REPT");
  });

  it("returns no rows for empty datasets", () => {
    expect(buildEmployeeMonthlySummary([], [], [])).toEqual([]);
  });
});
