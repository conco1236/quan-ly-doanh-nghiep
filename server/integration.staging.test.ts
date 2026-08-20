import { and, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { auditLogs, ingredients, inventoryTransactions } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { appRouter } from "./routers";

const integrationMode = process.env.RUN_INTEGRATION_TESTS === "true";
const expectedDatabase = process.env.STAGING_DATABASE_NAME ?? "erp_staging";

function getDatabaseName(databaseUrl: string | undefined) {
  if (!databaseUrl) return undefined;
  return new URL(databaseUrl).pathname.replace(/^\//, "");
}

function stagingContext(): TrpcContext {
  return {
    user: {
      id: 910001,
      openId: "staging-integration-admin",
      name: "Staging Integration Admin",
      email: "staging.integration@example.test",
      loginMethod: "integration-test",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "http",
      headers: {
        "x-forwarded-for": "127.0.0.1",
        "user-agent": "staging-integration-test",
        "x-device-id": "staging-integration-device",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
    accessMode: "full",
  };
}

const stagingDescribe = integrationMode ? describe : describe.skip;

stagingDescribe("staging database integration", () => {
  beforeAll(async () => {
    expect(process.env.APP_ENV).toBe("staging");
    expect(getDatabaseName(process.env.DATABASE_URL)).toBe(expectedDatabase);

    const db = await getDb();
    if (!db) throw new Error("Database staging chưa sẵn sàng cho integration test");
  });

  it("thực thi CRUD kho và audit trên database staging, sau đó dọn sạch dữ liệu test", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database staging chưa sẵn sàng cho integration test");

    const marker = `IT-STAGING-${Date.now()}`;
    const caller = appRouter.createCaller(stagingContext());
    let ingredientId: number | undefined;

    try {
      const created = await caller.ingredients.create({
        name: marker,
        unit: "kg",
        stockQuantity: 3,
        lowStockThreshold: 1,
        supplier: "Integration Test",
        notes: "Dữ liệu dùng một lần cho staging",
      });
      ingredientId = created.insertId;

      await caller.ingredients.transaction({
        ingredientId,
        type: "in",
        quantity: 2,
        reference: marker,
        note: "Kiểm thử nhập kho staging",
      });
      await caller.ingredients.update({
        id: ingredientId,
        name: marker,
        unit: "kg",
        stockQuantity: 7,
        lowStockThreshold: 2,
        supplier: "Integration Test",
        notes: "Đã cập nhật trong integration test",
      });

      const rows = await caller.ingredients.list();
      expect(rows).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: ingredientId, name: marker, stockQuantity: "7.00", lowStockThreshold: "2.00" }),
      ]));

      const writes = await db.select().from(auditLogs).where(and(
        eq(auditLogs.tableName, "ingredients"),
        eq(auditLogs.recordId, String(ingredientId)),
      ));
      expect(writes.filter(row => row.action === "create" || row.action === "update")).toHaveLength(3);

      await caller.ingredients.delete({ id: ingredientId });
      const remaining = await caller.ingredients.list();
      expect(remaining.some(row => row.id === ingredientId)).toBe(false);
    } finally {
      if (ingredientId) {
        await db.delete(inventoryTransactions).where(eq(inventoryTransactions.ingredientId, ingredientId));
        await db.delete(auditLogs).where(and(
          eq(auditLogs.tableName, "ingredients"),
          eq(auditLogs.recordId, String(ingredientId)),
        ));
        await db.delete(ingredients).where(eq(ingredients.id, ingredientId));
      }
    }
  });
});
