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
      [{ id: 1, employeeCode: "E001", fullName: "Bảo Bảo" }, { id: 2, employeeCode: "E002", fullName: "Lan Lan" }],
    );
    expect(rows).toEqual([
      ["Bảo Bảo", "E001", "2026-08", 2, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 1],
      ["Lan Lan", "E002", "2026-09", 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it("returns no rows for empty datasets", () => {
    expect(buildEmployeeMonthlySummary([], [], [])).toEqual([]);
  });
});
