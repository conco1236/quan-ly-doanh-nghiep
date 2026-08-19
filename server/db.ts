import { and, desc, eq, lt, sql, isNull, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, attendanceRecords, leaveRequests, ingredients, inventoryTransactions, beerTypes, recipes, productionBatches, productionSteps, customers, beerProducts, salesOrders, salesOrderItems, auditLogs, workflowTasks, qcStandards, qcResults, storedFiles, financeAccounts, financeTransactions, receivables, payables, suppliers, purchaseOrders, purchaseOrderItems } from "../drizzle/schema";
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

export async function listEmployees(ownerId?: number) { const db = await getDb(); return db ? db.select().from(employees).where(ownerId ? eq(employees.createdBy, ownerId) : undefined).orderBy(desc(employees.updatedAt)) : []; }
export async function listAttendanceRecords(input: { ownerId?: number; employeeId?: number; from?: Date; to?: Date } = {}) { const db = await getDb(); if (!db) return []; const filters = [input.ownerId ? eq(attendanceRecords.createdBy, input.ownerId) : undefined, input.employeeId ? eq(attendanceRecords.employeeId, input.employeeId) : undefined, input.from ? gte(attendanceRecords.workDate, input.from) : undefined, input.to ? lte(attendanceRecords.workDate, input.to) : undefined].filter(Boolean) as any[]; return db.select().from(attendanceRecords).where(filters.length ? and(...filters) : undefined).orderBy(desc(attendanceRecords.workDate)); }
export async function listLeaveRequests(input: { ownerId?: number; employeeId?: number; status?: "pending" | "approved" | "rejected" | "cancelled" } = {}) { const db = await getDb(); if (!db) return []; const filters = [input.ownerId ? eq(leaveRequests.createdBy, input.ownerId) : undefined, input.employeeId ? eq(leaveRequests.employeeId, input.employeeId) : undefined, input.status ? eq(leaveRequests.status, input.status) : undefined].filter(Boolean) as any[]; return db.select().from(leaveRequests).where(filters.length ? and(...filters) : undefined).orderBy(desc(leaveRequests.startDate)); }
export function calculateInclusiveLeaveDays(startDate: Date, endDate: Date) { const start = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()); const end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()); return Math.floor((end - start) / 86400000) + 1; }

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
export async function listSuppliers(ownerId?: number) { const db = await getDb(); return db ? db.select().from(suppliers).where(ownerId ? eq(suppliers.createdBy, ownerId) : undefined).orderBy(desc(suppliers.updatedAt)).limit(500) : []; }
export async function listPurchaseOrders(ownerId?: number) { const db = await getDb(); return db ? db.select().from(purchaseOrders).where(ownerId ? eq(purchaseOrders.createdBy, ownerId) : undefined).orderBy(desc(purchaseOrders.createdAt)).limit(500) : []; }
export async function listPurchaseOrderItems(orderId: number) { const db = await getDb(); return db ? db.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.orderId, orderId)).orderBy(purchaseOrderItems.id) : []; }
export function summarizePurchaseOrders(rows: Array<{ status: string; total: string | number }>) { return rows.reduce((summary, row) => { summary.count += 1; summary.total += Number(row.total) || 0; if (row.status === "draft") summary.draft += 1; if (row.status === "ordered" || row.status === "partially_received") summary.open += 1; if (row.status === "received") summary.received += 1; return summary; }, { count: 0, total: 0, draft: 0, open: 0, received: 0 }); }
export async function listFinanceAccounts(ownerId?: number) { const db = await getDb(); return db ? db.select().from(financeAccounts).where(ownerId ? eq(financeAccounts.createdBy, ownerId) : undefined).orderBy(financeAccounts.name) : []; }
export async function listFinanceTransactions(ownerId?: number, type?: "income" | "expense") { const db = await getDb(); if (!db) return []; const filters = [ownerId ? eq(financeTransactions.createdBy, ownerId) : undefined, type ? eq(financeTransactions.type, type) : undefined]; return db.select().from(financeTransactions).where(filters.some(Boolean) ? and(...filters.filter(Boolean) as any[]) : undefined).orderBy(desc(financeTransactions.transactionDate)).limit(500); }
export async function listReceivables(ownerId?: number) { const db = await getDb(); return db ? db.select().from(receivables).where(ownerId ? eq(receivables.createdBy, ownerId) : undefined).orderBy(desc(receivables.createdAt)).limit(500) : []; }
export async function listPayables(ownerId?: number) { const db = await getDb(); return db ? db.select().from(payables).where(ownerId ? eq(payables.createdBy, ownerId) : undefined).orderBy(desc(payables.createdAt)).limit(500) : []; }
export function summarizeFinanceTransactions(rows: Array<{ type: "income" | "expense"; amount: string | number; status?: string }>) { return rows.filter(row => row.status !== "cancelled").reduce((summary, row) => { const amount = Number(row.amount) || 0; if (row.type === "income") summary.income += amount; else summary.expense += amount; summary.net = summary.income - summary.expense; return summary; }, { income: 0, expense: 0, net: 0 }); }
export function summarizeOutstanding(rows: Array<{ amount: string | number; paidAmount: string | number; status?: string }>) { return rows.filter(row => row.status !== "cancelled").reduce((total, row) => total + Math.max(0, (Number(row.amount) || 0) - (Number(row.paidAmount) || 0)), 0); }
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

export async function cleanupOrphanedStoredFiles(olderThan: Date) { const db = await getDb(); if (!db) return { deleted: 0 }; const candidates = await db.select({ id: storedFiles.id }).from(storedFiles).where(and(eq(storedFiles.referenced, "no"), isNull(storedFiles.deletedAt), lt(storedFiles.createdAt, olderThan))); if (candidates.length) await db.delete(storedFiles).where(and(eq(storedFiles.referenced, "no"), isNull(storedFiles.deletedAt), lt(storedFiles.createdAt, olderThan))); return { deleted: candidates.length }; }

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

export type ReportRange = { from?: Date; to?: Date; ownerId?: number };

export function summarizeProductionSteps(rows: Array<{ stepType: string; status: string }>) {
  const byStep = new Map<string, { stepType: string; total: number; pending: number; inProgress: number; completed: number }>();
  for (const row of rows) { const stepType = String(row.stepType); const current = byStep.get(stepType) ?? { stepType, total: 0, pending: 0, inProgress: 0, completed: 0 }; current.total += 1; if (row.status === "pending") current.pending += 1; else if (row.status === "in_progress") current.inProgress += 1; else current.completed += 1; byStep.set(stepType, current); }
  return Array.from(byStep.values());
}

export function summarizeInventoryRows(items: Array<{ id: number; name: string; unit: string; stockQuantity: unknown; lowStockThreshold: unknown }>, transactions: Array<{ type: string; quantity: unknown; createdAt: Date | string }>) {
  const movements = new Map<string, { date: string; inbound: number; outbound: number }>();
  for (const tx of transactions) { const date = new Date(tx.createdAt).toISOString().slice(0, 10); const current = movements.get(date) ?? { date, inbound: 0, outbound: 0 }; if (tx.type === "in") current.inbound += Number(tx.quantity); else current.outbound += Number(tx.quantity); movements.set(date, current); }
  return { totalItems: items.length, totalStock: items.reduce((sum, item) => sum + Number(item.stockQuantity ?? 0), 0), lowStockCount: items.filter(item => Number(item.stockQuantity) <= Number(item.lowStockThreshold)).length, topStock: [...items].sort((a, b) => Number(b.stockQuantity) - Number(a.stockQuantity)).slice(0, 8), movementsByDay: Array.from(movements.values()).sort((a, b) => a.date.localeCompare(b.date)) };
}

export async function getProductionReport(range: ReportRange = {}) {
  const db = await getDb();
  if (!db) return { totalBatches: 0, plannedQuantity: 0, actualQuantity: 0, byStatus: [], byDay: [], byStep: [] };
  const filters = [range.ownerId ? eq(productionBatches.createdBy, range.ownerId) : undefined, range.from ? gte(productionBatches.createdAt, range.from) : undefined, range.to ? lte(productionBatches.createdAt, range.to) : undefined].filter(Boolean) as any[];
  const rows = await db.select({ id: productionBatches.id, status: productionBatches.status, createdAt: productionBatches.createdAt, plannedQuantity: productionBatches.plannedQuantity, actualQuantity: productionBatches.actualQuantity }).from(productionBatches).where(filters.length ? and(...filters) : undefined);
  const byStatus = new Map<string, { status: string; count: number; plannedQuantity: number; actualQuantity: number }>();
  const byDay = new Map<string, { date: string; batches: number; actualQuantity: number }>();
  for (const row of rows) {
    const status = String(row.status); const current = byStatus.get(status) ?? { status, count: 0, plannedQuantity: 0, actualQuantity: 0 }; current.count += 1; current.plannedQuantity += Number(row.plannedQuantity ?? 0); current.actualQuantity += Number(row.actualQuantity ?? 0); byStatus.set(status, current);
    const date = new Date(row.createdAt).toISOString().slice(0, 10); const daily = byDay.get(date) ?? { date, batches: 0, actualQuantity: 0 }; daily.batches += 1; daily.actualQuantity += Number(row.actualQuantity ?? 0); byDay.set(date, daily);
  }
  const stepFilters = [range.ownerId ? eq(productionBatches.createdBy, range.ownerId) : undefined, range.from ? gte(productionBatches.createdAt, range.from) : undefined, range.to ? lte(productionBatches.createdAt, range.to) : undefined].filter(Boolean) as any[];
  const stepRows = await db.select({ stepType: productionSteps.stepType, status: productionSteps.status }).from(productionSteps).innerJoin(productionBatches, eq(productionSteps.batchId, productionBatches.id)).where(stepFilters.length ? and(...stepFilters) : undefined);
  const byStep = summarizeProductionSteps(stepRows);
  return { totalBatches: rows.length, plannedQuantity: rows.reduce((sum, row) => sum + Number(row.plannedQuantity ?? 0), 0), actualQuantity: rows.reduce((sum, row) => sum + Number(row.actualQuantity ?? 0), 0), byStatus: Array.from(byStatus.values()), byDay: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)), byStep };
}

export async function getInventoryReport(range: ReportRange = {}) {
  const db = await getDb();
  if (!db) return { totalItems: 0, totalStock: 0, lowStockCount: 0, topStock: [], movementsByDay: [] };
  const ingredientFilters = range.ownerId ? [eq(ingredients.createdBy, range.ownerId)] : [];
  const items = await db.select({ id: ingredients.id, name: ingredients.name, unit: ingredients.unit, stockQuantity: ingredients.stockQuantity, lowStockThreshold: ingredients.lowStockThreshold }).from(ingredients).where(ingredientFilters.length ? and(...ingredientFilters) : undefined);
  const transactionFilters = [range.ownerId ? eq(inventoryTransactions.createdBy, range.ownerId) : undefined, range.from ? gte(inventoryTransactions.createdAt, range.from) : undefined, range.to ? lte(inventoryTransactions.createdAt, range.to) : undefined].filter(Boolean) as any[];
  const transactions = await db.select({ type: inventoryTransactions.type, quantity: inventoryTransactions.quantity, createdAt: inventoryTransactions.createdAt }).from(inventoryTransactions).where(transactionFilters.length ? and(...transactionFilters) : undefined);
  return summarizeInventoryRows(items, transactions);
}
