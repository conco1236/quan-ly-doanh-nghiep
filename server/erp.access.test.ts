import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "user"): TrpcContext {
  return {
    user: { id: 9, openId: `test-${role}`, name: "Test", email: "test@brewery.vn", loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin access control", () => {
  it("rejects a user from the admin user list", async () => {
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.admin.users()).rejects.toThrow("không có quyền");
  });

  it("allows an admin to query the admin user list", async () => {
    const caller = appRouter.createCaller(context("admin"));
    const result = await caller.admin.users();
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.role === "admin" || item.role === "user")).toBe(true);
  });
});
