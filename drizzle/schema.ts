import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const ingredients = mysqlTable("ingredients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  stockQuantity: decimal("stockQuantity", { precision: 12, scale: 2 }).default("0").notNull(),
  lowStockThreshold: decimal("lowStockThreshold", { precision: 12, scale: 2 }).default("0").notNull(),
  supplier: varchar("supplier", { length: 160 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const inventoryTransactions = mysqlTable("inventory_transactions", {
  id: int("id").autoincrement().primaryKey(),
  ingredientId: int("ingredientId").notNull(),
  type: mysqlEnum("type", ["in", "out"]).notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  reference: varchar("reference", { length: 160 }),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const beerTypes = mysqlTable("beer_types", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  abv: decimal("abv", { precision: 5, scale: 2 }).default("0").notNull(),
  color: varchar("color", { length: 80 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const recipes = mysqlTable("recipes", {
  id: int("id").autoincrement().primaryKey(),
  beerTypeId: int("beerTypeId").notNull(),
  ingredientId: int("ingredientId").notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
});

export const productionBatches = mysqlTable("production_batches", {
  id: int("id").autoincrement().primaryKey(),
  batchCode: varchar("batchCode", { length: 80 }).notNull().unique(),
  beerTypeId: int("beerTypeId").notNull(),
  plannedQuantity: decimal("plannedQuantity", { precision: 12, scale: 2 }).notNull(),
  actualQuantity: decimal("actualQuantity", { precision: 12, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["planned", "in_progress", "completed", "cancelled"]).default("planned").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  notes: text("notes"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productionSteps = mysqlTable("production_steps", {
  id: int("id").autoincrement().primaryKey(),
  batchId: int("batchId").notNull(),
  stepType: mysqlEnum("stepType", ["mashing", "fermentation", "filtration", "bottling"]).notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  note: text("note"),
});

export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  address: text("address"),
  email: varchar("email", { length: 160 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const beerProducts = mysqlTable("beer_products", {
  id: int("id").autoincrement().primaryKey(),
  beerTypeId: int("beerTypeId").notNull(),
  sku: varchar("sku", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  unit: varchar("unit", { length: 32 }).default("thùng").notNull(),
  price: decimal("price", { precision: 14, scale: 2 }).default("0").notNull(),
  stockQuantity: decimal("stockQuantity", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const salesOrders = mysqlTable("sales_orders", {
  id: int("id").autoincrement().primaryKey(),
  orderCode: varchar("orderCode", { length: 80 }).notNull().unique(),
  customerId: int("customerId").notNull(),
  status: mysqlEnum("status", ["new", "processing", "completed", "cancelled"]).default("new").notNull(),
  subtotal: decimal("subtotal", { precision: 14, scale: 2 }).default("0").notNull(),
  discount: decimal("discount", { precision: 14, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 14, scale: 2 }).default("0").notNull(),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const salesOrderItems = mysqlTable("sales_order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  unitPrice: decimal("unitPrice", { precision: 14, scale: 2 }).notNull(),
  total: decimal("total", { precision: 14, scale: 2 }).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Ingredient = typeof ingredients.$inferSelect;
export type BeerType = typeof beerTypes.$inferSelect;
export type ProductionBatch = typeof productionBatches.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type SalesOrder = typeof salesOrders.$inferSelect;
