import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb, dashboardSummary, listIngredients, listLowStockIngredients, listInventoryTransactions, listBeerTypes, listRecipes, listProductionBatches, listProductionSteps, listCustomers, listProducts, listSalesOrders } from "./db";
import { ingredients, inventoryTransactions, beerTypes, recipes, productionBatches, productionSteps, customers, beerProducts, salesOrders, salesOrderItems, users } from "../drizzle/schema";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";

const idInput = z.object({ id: z.number().int().positive() });
const ingredientInput = z.object({ name: z.string().min(1), unit: z.string().min(1), stockQuantity: z.number().nonnegative(), lowStockThreshold: z.number().nonnegative(), supplier: z.string().optional(), notes: z.string().optional() });
const beerInput = z.object({ name: z.string().min(1), description: z.string().optional(), abv: z.number().nonnegative(), color: z.string().optional() });
const customerInput = z.object({ name: z.string().min(1), phone: z.string().optional(), address: z.string().optional(), email: z.string().optional(), notes: z.string().optional() });

const requireAdmin = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new Error("Bạn không có quyền truy cập khu vực quản trị");
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  dashboard: router({ summary: protectedProcedure.query(() => dashboardSummary()) }),
  ingredients: router({
    list: protectedProcedure.query(() => listIngredients()),
    lowStock: protectedProcedure.query(() => listLowStockIngredients()),
    transactions: protectedProcedure.query(() => listInventoryTransactions()),
    create: protectedProcedure.input(ingredientInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const [row] = await db.insert(ingredients).values({ ...input, stockQuantity: input.stockQuantity.toString(), lowStockThreshold: input.lowStockThreshold.toString() }); return row; }),
    update: protectedProcedure.input(idInput.merge(ingredientInput)).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const { id, ...data } = input; await db.update(ingredients).set({ ...data, stockQuantity: data.stockQuantity.toString(), lowStockThreshold: data.lowStockThreshold.toString() }).where(eq(ingredients.id, id)); return { success: true }; }),
    delete: adminProcedure.input(idInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.delete(ingredients).where(eq(ingredients.id, input.id)); return { success: true }; }),
    transaction: protectedProcedure.input(z.object({ ingredientId: z.number().int(), type: z.enum(["in", "out"]), quantity: z.number().positive(), reference: z.string().optional(), note: z.string().optional() })).mutation(async ({ input, ctx }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const ingredient = (await db.select().from(ingredients).where(eq(ingredients.id, input.ingredientId)).limit(1))[0]; if (!ingredient) throw new Error("Không tìm thấy nguyên liệu"); const next = Number(ingredient.stockQuantity) + (input.type === "in" ? input.quantity : -input.quantity); if (next < 0) throw new Error("Tồn kho không đủ để xuất"); await db.update(ingredients).set({ stockQuantity: next.toString() }).where(eq(ingredients.id, input.ingredientId)); await db.insert(inventoryTransactions).values({ ...input, quantity: input.quantity.toString(), createdBy: ctx.user.id }); return { success: true }; }),
  }),
  beerTypes: router({
    list: protectedProcedure.query(() => listBeerTypes()),
    recipes: protectedProcedure.input(z.object({ beerTypeId: z.number().int().positive() })).query(({ input }) => listRecipes(input.beerTypeId)),
    createRecipe: protectedProcedure.input(z.object({ beerTypeId: z.number().int(), ingredientId: z.number().int(), quantity: z.number().positive(), unit: z.string().min(1) })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.insert(recipes).values({ ...input, quantity: input.quantity.toString() }); return { success: true }; }),
    updateRecipe: protectedProcedure.input(idInput.merge(z.object({ quantity: z.number().positive(), unit: z.string().min(1) }))).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const { id, ...data } = input; await db.update(recipes).set({ ...data, quantity: data.quantity.toString() }).where(eq(recipes.id, id)); return { success: true }; }),
    deleteRecipe: adminProcedure.input(idInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.delete(recipes).where(eq(recipes.id, input.id)); return { success: true }; }),
    create: protectedProcedure.input(beerInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.insert(beerTypes).values({ ...input, abv: input.abv.toString() }); return { success: true }; }),
    update: protectedProcedure.input(idInput.merge(beerInput)).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const { id, ...data } = input; await db.update(beerTypes).set({ ...data, abv: data.abv.toString() }).where(eq(beerTypes.id, id)); return { success: true }; }),
    delete: adminProcedure.input(idInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.delete(beerTypes).where(eq(beerTypes.id, input.id)); return { success: true }; }),
  }),
  production: router({
    list: protectedProcedure.query(() => listProductionBatches()),
    steps: protectedProcedure.input(idInput).query(({ input }) => listProductionSteps(input.id)),
    createBatch: protectedProcedure.input(z.object({ batchCode: z.string().min(1), beerTypeId: z.number().int(), plannedQuantity: z.number().positive(), notes: z.string().optional() })).mutation(async ({ input, ctx }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const [result] = await db.insert(productionBatches).values({ ...input, plannedQuantity: input.plannedQuantity.toString(), createdBy: ctx.user.id }); const batchId = result.insertId; await db.insert(productionSteps).values((["mashing", "fermentation", "filtration", "bottling"] as const).map(stepType => ({ batchId, stepType }))); return { batchId }; }),
    updateBatch: protectedProcedure.input(idInput.merge(z.object({ status: z.enum(["planned", "in_progress", "completed", "cancelled"]).optional(), actualQuantity: z.number().nonnegative().optional(), notes: z.string().optional() }))).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const { id, ...data } = input; await db.update(productionBatches).set({ ...data, actualQuantity: data.actualQuantity?.toString() }).where(eq(productionBatches.id, id)); return { success: true }; }),
    updateStep: protectedProcedure.input(idInput.merge(z.object({ status: z.enum(["pending", "in_progress", "completed"]), note: z.string().optional() }))).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const { id, ...data } = input; await db.update(productionSteps).set(data).where(eq(productionSteps.id, id)); return { success: true }; }),
  }),
  customers: router({ list: protectedProcedure.query(() => listCustomers()), purchaseHistory: protectedProcedure.input(idInput).query(async ({ input }) => { const db = await getDb(); return db ? db.select().from(salesOrders).where(eq(salesOrders.customerId, input.id)).orderBy(desc(salesOrders.createdAt)) : []; }), create: protectedProcedure.input(customerInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.insert(customers).values(input); return { success: true }; }), update: protectedProcedure.input(idInput.merge(customerInput)).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const { id, ...data } = input; await db.update(customers).set(data).where(eq(customers.id, id)); return { success: true }; }), delete: adminProcedure.input(idInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.delete(customers).where(eq(customers.id, input.id)); return { success: true }; }) }),
  products: router({ list: protectedProcedure.query(() => listProducts()) }),
  sales: router({
    list: protectedProcedure.query(() => listSalesOrders()),
    create: protectedProcedure.input(z.object({ orderCode: z.string().min(1), customerId: z.number().int(), items: z.array(z.object({ productId: z.number().int(), quantity: z.number().positive(), unitPrice: z.number().nonnegative() })).min(1), discount: z.number().nonnegative().default(0), note: z.string().optional() })).mutation(async ({ input, ctx }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0); const total = Math.max(0, subtotal - input.discount); const [result] = await db.insert(salesOrders).values({ orderCode: input.orderCode, customerId: input.customerId, subtotal: subtotal.toString(), discount: input.discount.toString(), total: total.toString(), note: input.note, createdBy: ctx.user.id }); await db.insert(salesOrderItems).values(input.items.map(item => ({ orderId: result.insertId, productId: item.productId, quantity: item.quantity.toString(), unitPrice: item.unitPrice.toString(), total: (item.quantity * item.unitPrice).toString() }))); return { orderId: result.insertId }; }),
    updateStatus: protectedProcedure.input(idInput.merge(z.object({ status: z.enum(["new", "processing", "completed", "cancelled"]) }))).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.update(salesOrders).set({ status: input.status }).where(eq(salesOrders.id, input.id)); return { success: true }; }),
  }),
  admin: router({ users: requireAdmin.query(async () => { const db = await getDb(); return db ? db.select({ id: users.id, name: users.name, email: users.email, role: users.role, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.lastSignedIn)) : []; }), setRole: requireAdmin.input(z.object({ id: z.number().int().positive(), role: z.enum(["admin", "user"]) })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database chưa sẵn sàng"); await db.update(users).set({ role: input.role }).where(eq(users.id, input.id)); return { success: true }; }) }),
});

export type AppRouter = typeof appRouter;
