import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = { user: { id: 9, openId: "validation-user", name: "Test", email: "test@brewery.vn", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;

describe("ERP input validation", () => {
  const caller = appRouter.createCaller(ctx);
  it("rejects negative inventory quantity", async () => { await expect(caller.ingredients.transaction({ ingredientId: 1, type: "out", quantity: -1 })).rejects.toThrow(); });
  it("rejects empty sales order items", async () => { await expect(caller.sales.create({ orderCode: "TEST", customerId: 1, items: [], discount: 0 })).rejects.toThrow(); });
  it("rejects invalid production quantity", async () => { await expect(caller.production.createBatch({ batchCode: "TEST", beerTypeId: 1, plannedQuantity: 0 })).rejects.toThrow(); });
});
