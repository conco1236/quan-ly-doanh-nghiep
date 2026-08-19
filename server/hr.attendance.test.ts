import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { calculateInclusiveLeaveDays } from "./db";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "user"): TrpcContext {
  return {
    user: { id: role === "admin" ? 1 : 21, openId: `attendance-${role}`, name: "Attendance Test", email: "attendance@brewery.vn", loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
    accessMode: "full",
  };
}

describe("attendance and leave rules", () => {
  it("calculates inclusive leave days", () => {
    expect(calculateInclusiveLeaveDays(new Date("2026-08-01T00:00:00Z"), new Date("2026-08-01T00:00:00Z"))).toBe(1);
    expect(calculateInclusiveLeaveDays(new Date("2026-08-01T00:00:00Z"), new Date("2026-08-03T00:00:00Z"))).toBe(3);
    expect(calculateInclusiveLeaveDays(new Date("2026-08-03T00:00:00Z"), new Date("2026-08-01T00:00:00Z"))).toBe(-1);
  });

  it("rejects invalid leave dates before database access", async () => {
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.leaves.create({ employeeId: 1, startDate: new Date("2026-08-05"), endDate: new Date("2026-08-01") })).rejects.toThrow("Ngày kết thúc");
  });

  it("requires admin for leave approval", async () => {
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.leaves.approve({ id: 1, status: "approved" })).rejects.toThrow("permission");
  });
});
