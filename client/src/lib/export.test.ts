import { describe, expect, it } from "vitest";
import { escapeCsvCell, toCsv, buildXlsxWorkbook } from "./export";

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
  });
});
