import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "user"): TrpcContext {
  return {
    user: { id: 9, openId: `test-${role}`, name: "Test", email: "test@brewery.vn", loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
    accessMode: "full",
  };
}

describe("admin access control", () => {
  it("rejects a user from the admin user list", async () => {
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.admin.users()).rejects.toThrow("không có quyền");
  });

  it("blocks an admin query when request mode is deny", async () => {
    const denied = { ...context("admin"), accessMode: "deny" as const };
    await expect(appRouter.createCaller(denied).admin.users()).rejects.toThrow("IP");
  });

  it("blocks protected mutations in read_only and deny modes", async () => {
    const input = { name: "Guard test", unit: "kg", stockQuantity: 1, lowStockThreshold: 1 };
    await expect(appRouter.createCaller({ ...context("user"), accessMode: "read_only" }).ingredients.create(input)).rejects.toThrow("chỉ được xem");
    await expect(appRouter.createCaller({ ...context("admin"), accessMode: "deny" }).ingredients.create(input)).rejects.toThrow("IP");
  });

  it("allows an admin to query the admin user list", async () => {
    const caller = appRouter.createCaller(context("admin"));
    const result = await caller.admin.users();
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.role === "admin" || item.role === "user")).toBe(true);
  });
});
