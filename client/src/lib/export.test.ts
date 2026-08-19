import { describe, expect, it } from "vitest";
import { escapeCsvCell, toCsv, buildXlsxWorkbook, buildEmployeeMonthlySummary } from "./export";

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

  it("returns no rows for empty datasets", () => {
    expect(buildEmployeeMonthlySummary([], [], [])).toEqual([]);
  });
});
