import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = { user: { id: 12, openId: "hr-validation-user", name: "HR Test", email: "hr@brewery.vn", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;

const caller = appRouter.createCaller(ctx);

describe("Employee CRUD validation", () => {
  it("rejects missing required employee fields", async () => {
    await expect(caller.employees.create({ employeeCode: "", fullName: "", department: "", position: "" })).rejects.toThrow();
  });

  it("rejects malformed email before database access", async () => {
    await expect(caller.employees.create({ employeeCode: "NV-001", fullName: "Nguyễn Văn A", department: "Sản xuất", position: "Kỹ thuật viên", email: "not-an-email" })).rejects.toThrow();
  });
});
