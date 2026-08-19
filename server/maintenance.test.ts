import { describe, expect, it } from "vitest";
import { summarizeMaintenance, summarizeAttendanceMonthly } from "./db";

describe("maintenance summaries", () => {
  it("cảnh báo lịch quá hạn và phiếu sự cố ưu tiên cao", () => {
    const now = new Date("2026-08-19T00:00:00Z");
    expect(summarizeMaintenance([
      { nextDueAt: new Date("2026-08-18T00:00:00Z"), status: "active" },
      { nextDueAt: new Date("2026-08-20T00:00:00Z"), status: "active" },
      { nextDueAt: new Date("2026-08-10T00:00:00Z"), status: "paused" },
    ], [
      { status: "open", priority: "critical", cost: "100000" },
      { status: "in_progress", priority: "high", cost: 50000 },
      { status: "cancelled", priority: "critical", cost: 90000 },
    ], now)).toEqual({ overdue: 1, openTickets: 2, criticalTickets: 1, totalCost: 150000 });
  });
});

describe("monthly attendance summary", () => {
  it("gộp theo nhân viên và tháng, không trộn dữ liệu tháng khác", () => {
    const result = summarizeAttendanceMonthly([
      { employeeId: 1, workDate: new Date("2026-08-01T00:00:00Z"), status: "present", checkIn: new Date("2026-08-01T08:00:00Z"), checkOut: new Date("2026-08-01T17:00:00Z") },
      { employeeId: 1, workDate: new Date("2026-08-02T00:00:00Z"), status: "late" },
      { employeeId: 1, workDate: new Date("2026-07-31T00:00:00Z"), status: "absent" },
    ], [
      { employeeId: 1, startDate: new Date("2026-08-10T00:00:00Z"), endDate: new Date("2026-08-11T00:00:00Z"), totalDays: "2", status: "approved" },
      { employeeId: 1, startDate: new Date("2026-08-20T00:00:00Z"), endDate: new Date("2026-08-20T00:00:00Z"), totalDays: 1, status: "pending" },
    ], "2026-08");
    expect(result).toEqual([{ employeeId: 1, month: "2026-08", workDays: 2, present: 2, late: 1, absent: 0, holiday: 0, leaveDays: 3, approvedLeaveDays: 2, pendingLeaveDays: 1, workHours: 9 }]);
  });
});
