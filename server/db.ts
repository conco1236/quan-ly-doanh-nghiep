import { and, desc, eq, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, ingredients, inventoryTransactions, beerTypes, recipes, productionBatches, productionSteps, customers, beerProducts, salesOrders, salesOrderItems, auditLogs, workflowTasks, qcStandards, qcResults } from "../drizzle/schema";
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

export async function listIngredients(ownerId?: number) { const db = await getDb(); return db ? db.select().from(ingredients).where(ownerId ? eq(ingredients.createdBy, ownerId) : undefined).orderBy(desc(ingredients.updatedAt)) : []; }
export async function listIngredientsPage(input: { limit: number; cursor?: number; ownerId?: number }) { const db = await getDb(); if (!db) return { items: [], nextCursor: null }; const items = await db.select().from(ingredients).where(input.cursor && input.ownerId ? and(lt(ingredients.id, input.cursor), eq(ingredients.createdBy, input.ownerId)) : input.cursor ? lt(ingredients.id, input.cursor) : input.ownerId ? eq(ingredients.createdBy, input.ownerId) : undefined).orderBy(desc(ingredients.id)).limit(input.limit + 1); const hasMore = items.length > input.limit; const page = hasMore ? items.slice(0, input.limit) : items; return { items: page, nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null }; }
export async function listLowStockIngredients() { const db = await getDb(); return db ? db.select().from(ingredients).where(sql`${ingredients.stockQuantity} <= ${ingredients.lowStockThreshold}`).orderBy(ingredients.name) : []; }
export async function listInventoryTransactions() { const db = await getDb(); return db ? db.select().from(inventoryTransactions).orderBy(desc(inventoryTransactions.createdAt)).limit(50) : []; }
export async function listBeerTypes(ownerId?: number) { const db = await getDb(); return db ? db.select().from(beerTypes).where(ownerId ? eq(beerTypes.createdBy, ownerId) : undefined).orderBy(desc(beerTypes.createdAt)) : []; }
export async function listRecipes(beerTypeId?: number, ownerId?: number) { const db = await getDb(); return db ? db.select().from(recipes).where(beerTypeId && ownerId ? and(eq(recipes.beerTypeId, beerTypeId), eq(recipes.createdBy, ownerId)) : beerTypeId ? eq(recipes.beerTypeId, beerTypeId) : ownerId ? eq(recipes.createdBy, ownerId) : undefined) : []; }
export async function listProductionBatches(ownerId?: number) { const db = await getDb(); return db ? db.select().from(productionBatches).where(ownerId ? eq(productionBatches.createdBy, ownerId) : undefined).orderBy(desc(productionBatches.createdAt)).limit(100) : []; }
export async function listProductionSteps(batchId: number) { const db = await getDb(); return db ? db.select().from(productionSteps).where(eq(productionSteps.batchId, batchId)).orderBy(productionSteps.id) : []; }
export async function listCustomers(ownerId?: number) { const db = await getDb(); return db ? db.select().from(customers).where(ownerId ? eq(customers.createdBy, ownerId) : undefined).orderBy(desc(customers.createdAt)) : []; }
export async function listProducts() { const db = await getDb(); return db ? db.select().from(beerProducts).orderBy(desc(beerProducts.createdAt)) : []; }
export async function listSalesOrders(ownerId?: number) { const db = await getDb(); return db ? db.select().from(salesOrders).where(ownerId ? eq(salesOrders.createdBy, ownerId) : undefined).orderBy(desc(salesOrders.createdAt)).limit(100) : []; }
export async function listAuditLogs(limit = 100) { const db = await getDb(); return db ? db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit) : []; }
export async function listWorkflowTasks(userId?: number) { const db = await getDb(); return db ? db.select().from(workflowTasks).where(userId ? eq(workflowTasks.assigneeId, userId) : undefined).orderBy(desc(workflowTasks.updatedAt)).limit(200) : []; }
export function selectQcStandardForBeerType<T extends { beerTypeId: number; fieldKey: string }>(standards: T[], beerTypeId: number, fieldKey: string) { return standards.find(standard => standard.beerTypeId === beerTypeId && standard.fieldKey === fieldKey); }
export async function listQcStandards(beerTypeId?: number) { const db = await getDb(); return db ? db.select().from(qcStandards).where(beerTypeId ? eq(qcStandards.beerTypeId, beerTypeId) : undefined).orderBy(qcStandards.fieldKey) : []; }
export async function listQcResults(batchId: number) { const db = await getDb(); return db ? db.select().from(qcResults).where(eq(qcResults.batchId, batchId)).orderBy(desc(qcResults.createdAt)) : []; }

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

export async function getCrossSheetLinks(input: { tableName: string; recordId: number }) {
  const db = await getDb();
  if (!db) return { source: null, customer: [], orders: [], batches: [], beerTypes: [], recipes: [], inventoryTransactions: [], qcResults: [] };
  if (input.tableName === "sales_orders") {
    const order = (await db.select().from(salesOrders).where(eq(salesOrders.id, input.recordId)).limit(1))[0];
    return { source: order ?? null, customer: order ? await db.select().from(customers).where(eq(customers.id, order.customerId)) : [], orders: order ? [order] : [], orderItems: order ? await db.select().from(salesOrderItems).where(eq(salesOrderItems.orderId, order.id)) : [], batches: [], beerTypes: [], recipes: [], inventoryTransactions: [], qcResults: [] };
  }
  if (input.tableName === "production_batches") {
    const batch = (await db.select().from(productionBatches).where(eq(productionBatches.id, input.recordId)).limit(1))[0];
    return { source: batch ?? null, customer: [], orders: [], batches: batch ? [batch] : [], beerTypes: batch ? await db.select().from(beerTypes).where(eq(beerTypes.id, batch.beerTypeId)) : [], recipes: batch ? await db.select().from(recipes).where(eq(recipes.beerTypeId, batch.beerTypeId)) : [], inventoryTransactions: [], qcResults: batch ? await db.select().from(qcResults).where(eq(qcResults.batchId, batch.id)) : [] };
  }
  if (input.tableName === "beer_types") { const beerType = (await db.select().from(beerTypes).where(eq(beerTypes.id, input.recordId)).limit(1))[0]; return { source: beerType ?? null, customer: [], orders: [], batches: beerType ? await db.select().from(productionBatches).where(eq(productionBatches.beerTypeId, beerType.id)) : [], beerTypes: beerType ? [beerType] : [], recipes: beerType ? await db.select().from(recipes).where(eq(recipes.beerTypeId, beerType.id)) : [], inventoryTransactions: [], qcResults: [] }; }
  if (input.tableName === "customers") {
    const customer = (await db.select().from(customers).where(eq(customers.id, input.recordId)).limit(1))[0];
    return { source: customer ?? null, customer: customer ? [customer] : [], orders: customer ? await db.select().from(salesOrders).where(eq(salesOrders.customerId, customer.id)).orderBy(desc(salesOrders.createdAt)) : [], batches: [], beerTypes: [], recipes: [], inventoryTransactions: [], qcResults: [] };
  }
  if (input.tableName === "ingredients") {
    const ingredient = (await db.select().from(ingredients).where(eq(ingredients.id, input.recordId)).limit(1))[0];
    return { source: ingredient ?? null, customer: [], orders: [], batches: [], beerTypes: [], recipes: [], inventoryTransactions: ingredient ? await db.select().from(inventoryTransactions).where(eq(inventoryTransactions.ingredientId, ingredient.id)).orderBy(desc(inventoryTransactions.createdAt)) : [], qcResults: [] };
  }
  return { source: null, customer: [], orders: [], batches: [], beerTypes: [], recipes: [], inventoryTransactions: [], qcResults: [] };
}

export function crossSheetTargetTables(tableName: string): string[] {
  const mapping: Record<string, string[]> = {
    sales_orders: ["customers", "sales_orders", "sales_order_items"],
    production_batches: ["beer_types", "recipes", "qc_results", "production_batches"],
    beer_types: ["beer_types", "recipes", "production_batches"],
    customers: ["customers", "sales_orders"],
    ingredients: ["ingredients", "inventory_transactions"],
  };
  return mapping[tableName] ?? [];
}
