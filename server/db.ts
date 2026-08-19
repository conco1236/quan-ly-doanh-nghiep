import { and, desc, eq, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, ingredients, inventoryTransactions, beerTypes, recipes, productionBatches, productionSteps, customers, beerProducts, salesOrders, salesOrderItems } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  values.lastSignedIn ??= new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listIngredients() { const db = await getDb(); return db ? db.select().from(ingredients).orderBy(desc(ingredients.updatedAt)) : []; }
export async function listLowStockIngredients() { const db = await getDb(); return db ? db.select().from(ingredients).where(sql`${ingredients.stockQuantity} <= ${ingredients.lowStockThreshold}`).orderBy(ingredients.name) : []; }
export async function listInventoryTransactions() { const db = await getDb(); return db ? db.select().from(inventoryTransactions).orderBy(desc(inventoryTransactions.createdAt)).limit(50) : []; }
export async function listBeerTypes() { const db = await getDb(); return db ? db.select().from(beerTypes).orderBy(desc(beerTypes.createdAt)) : []; }
export async function listRecipes(beerTypeId?: number) { const db = await getDb(); return db ? db.select().from(recipes).where(beerTypeId ? eq(recipes.beerTypeId, beerTypeId) : undefined) : []; }
export async function listProductionBatches() { const db = await getDb(); return db ? db.select().from(productionBatches).orderBy(desc(productionBatches.createdAt)).limit(100) : []; }
export async function listProductionSteps(batchId: number) { const db = await getDb(); return db ? db.select().from(productionSteps).where(eq(productionSteps.batchId, batchId)).orderBy(productionSteps.id) : []; }
export async function listCustomers() { const db = await getDb(); return db ? db.select().from(customers).orderBy(desc(customers.createdAt)) : []; }
export async function listProducts() { const db = await getDb(); return db ? db.select().from(beerProducts).orderBy(desc(beerProducts.createdAt)) : []; }
export async function listSalesOrders() { const db = await getDb(); return db ? db.select().from(salesOrders).orderBy(desc(salesOrders.createdAt)).limit(100) : []; }

export async function dashboardSummary() {
  const db = await getDb();
  if (!db) return { revenue: 0, inventoryValue: 0, orderCount: 0, activeBatches: 0, lowStockCount: 0, productionByStatus: [] };
  const [revenue, inventoryValue, orderCount, activeBatches, lowStockCount, productionByStatus] = await Promise.all([
    db.select({ value: sql<string>`coalesce(sum(${salesOrders.total}), 0)` }).from(salesOrders).where(eq(salesOrders.status, "completed")),
    db.select({ value: sql<string>`coalesce(sum(${ingredients.stockQuantity}), 0)` }).from(ingredients),
    db.select({ value: sql<number>`count(*)` }).from(salesOrders),
    db.select({ value: sql<number>`count(*)` }).from(productionBatches).where(eq(productionBatches.status, "in_progress")),
    db.select({ value: sql<number>`count(*)` }).from(ingredients).where(sql`${ingredients.stockQuantity} <= ${ingredients.lowStockThreshold}`),
    db.select({ status: productionBatches.status, count: sql<number>`count(*)` }).from(productionBatches).groupBy(productionBatches.status),
  ]);
  return { revenue: Number(revenue[0]?.value ?? 0), inventoryValue: Number(inventoryValue[0]?.value ?? 0), orderCount: Number(orderCount[0]?.value ?? 0), activeBatches: Number(activeBatches[0]?.value ?? 0), lowStockCount: Number(lowStockCount[0]?.value ?? 0), productionByStatus };
}
