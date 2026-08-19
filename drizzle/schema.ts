import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, index, uniqueIndex } from "drizzle-orm/mysql-core";

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

export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  employeeCode: varchar("employeeCode", { length: 40 }).notNull().unique(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 160 }),
  address: text("address"),
  department: varchar("department", { length: 120 }).notNull(),
  position: varchar("position", { length: 120 }).notNull(),
  employmentStatus: mysqlEnum("employmentStatus", ["active", "on_leave", "terminated"]).default("active").notNull(),
  hireDate: timestamp("hireDate"),
  notes: text("notes"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("employees_created_by_idx").on(table.createdBy), departmentIdx: index("employees_department_idx").on(table.department), statusIdx: index("employees_status_idx").on(table.employmentStatus), nameIdx: index("employees_name_idx").on(table.fullName) }));

export const attendanceRecords = mysqlTable("attendance_records", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  workDate: timestamp("workDate").notNull(),
  status: mysqlEnum("status", ["present", "late", "absent", "leave", "holiday"]).default("present").notNull(),
  checkIn: timestamp("checkIn"),
  checkOut: timestamp("checkOut"),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ employeeIdx: index("attendance_employee_idx").on(table.employeeId), workDateIdx: index("attendance_work_date_idx").on(table.workDate), ownerIdx: index("attendance_created_by_idx").on(table.createdBy), uniqueEmployeeDate: uniqueIndex("attendance_employee_date_unique").on(table.employeeId, table.workDate) }));

export const leaveRequests = mysqlTable("leave_requests", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  leaveType: mysqlEnum("leaveType", ["annual", "sick", "unpaid", "other"]).default("annual").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  totalDays: decimal("totalDays", { precision: 6, scale: 2 }).notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "cancelled"]).default("pending").notNull(),
  approvedBy: int("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ employeeIdx: index("leave_employee_idx").on(table.employeeId), statusIdx: index("leave_status_idx").on(table.status), startDateIdx: index("leave_start_date_idx").on(table.startDate), ownerIdx: index("leave_created_by_idx").on(table.createdBy) }));

export const ingredients = mysqlTable("ingredients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  stockQuantity: decimal("stockQuantity", { precision: 12, scale: 2 }).default("0").notNull(),
  lowStockThreshold: decimal("lowStockThreshold", { precision: 12, scale: 2 }).default("0").notNull(),
  supplier: varchar("supplier", { length: 160 }),
  notes: text("notes"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("ingredients_created_by_idx").on(table.createdBy), nameIdx: index("ingredients_name_idx").on(table.name) }));

export const inventoryTransactions = mysqlTable("inventory_transactions", {
  id: int("id").autoincrement().primaryKey(),
  ingredientId: int("ingredientId").notNull(),
  type: mysqlEnum("type", ["in", "out"]).notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  reference: varchar("reference", { length: 160 }),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ ingredientIdx: index("inventory_transactions_ingredient_idx").on(table.ingredientId), createdIdx: index("inventory_transactions_created_idx").on(table.createdAt) }));

export const beerTypes = mysqlTable("beer_types", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  abv: decimal("abv", { precision: 5, scale: 2 }).default("0").notNull(),
  color: varchar("color", { length: 80 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("beer_types_created_by_idx").on(table.createdBy), nameIdx: index("beer_types_name_idx").on(table.name) }));

export const recipes = mysqlTable("recipes", {
  id: int("id").autoincrement().primaryKey(),
  beerTypeId: int("beerTypeId").notNull(),
  ingredientId: int("ingredientId").notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  createdBy: int("createdBy"),
}, table => ({ beerIdx: index("recipes_beer_idx").on(table.beerTypeId), ingredientIdx: index("recipes_ingredient_idx").on(table.ingredientId) }));

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
}, table => ({ ownerIdx: index("production_batches_created_by_idx").on(table.createdBy), statusIdx: index("production_batches_status_idx").on(table.status), createdIdx: index("production_batches_created_idx").on(table.createdAt) }));

export const productionSteps = mysqlTable("production_steps", {
  id: int("id").autoincrement().primaryKey(),
  batchId: int("batchId").notNull(),
  stepType: mysqlEnum("stepType", ["mashing", "fermentation", "filtration", "bottling"]).notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  note: text("note"),
  createdBy: int("createdBy"),
}, table => ({ batchIdx: index("production_steps_batch_idx").on(table.batchId) }));

export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  address: text("address"),
  provinceCode: varchar("provinceCode", { length: 16 }),
  districtCode: varchar("districtCode", { length: 16 }),
  email: varchar("email", { length: 160 }),
  notes: text("notes"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("customers_created_by_idx").on(table.createdBy), phoneIdx: index("customers_phone_idx").on(table.phone), locationIdx: index("customers_location_idx").on(table.provinceCode, table.districtCode) }));

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
}, table => ({ ownerIdx: index("sales_orders_created_by_idx").on(table.createdBy), statusIdx: index("sales_orders_status_idx").on(table.status), createdIdx: index("sales_orders_created_idx").on(table.createdAt) }));

export const salesOrderItems = mysqlTable("sales_order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  unitPrice: decimal("unitPrice", { precision: 14, scale: 2 }).notNull(),
  total: decimal("total", { precision: 14, scale: 2 }).notNull(),
}, table => ({ orderIdx: index("sales_order_items_order_idx").on(table.orderId) }));

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  tableName: varchar("tableName", { length: 100 }).notNull(),
  recordId: varchar("recordId", { length: 80 }).notNull(),
  action: mysqlEnum("action", ["create", "update", "delete", "batch_insert", "workflow"]).notNull(),
  fieldName: varchar("fieldName", { length: 100 }),
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  actorId: int("actorId"),
  ipAddress: varchar("ipAddress", { length: 64 }),
  deviceId: varchar("deviceId", { length: 160 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ recordIdx: index("audit_logs_record_idx").on(table.tableName, table.recordId), actorIdx: index("audit_logs_actor_idx").on(table.actorId), createdIdx: index("audit_logs_created_idx").on(table.createdAt) }));

export const deviceSessions = mysqlTable("device_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 160 }).notNull(),
  fingerprintHash: varchar("fingerprintHash", { length: 128 }),
  lastIp: varchar("lastIp", { length: 64 }),
  status: mysqlEnum("status", ["pending", "approved", "blocked"]).default("pending").notNull(),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ userIdx: index("device_sessions_user_idx").on(table.userId), deviceIdx: index("device_sessions_device_idx").on(table.deviceId) }));

export const accessPolicies = mysqlTable("access_policies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  allowedCidrs: text("allowedCidrs").notNull(),
  outsideMode: mysqlEnum("outsideMode", ["deny", "read_only"]).default("read_only").notNull(),
  enabled: mysqlEnum("enabled", ["yes", "no"]).default("yes").notNull(),
  createdBy: int("createdBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const storedFiles = mysqlTable("stored_files", {
  id: int("id").autoincrement().primaryKey(),
  storageKey: varchar("storageKey", { length: 320 }).notNull().unique(),
  ownerId: int("ownerId"),
  referenced: mysqlEnum("referenced", ["yes", "no"]).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
}, table => ({ ownerIdx: index("stored_files_owner_idx").on(table.ownerId), referenceIdx: index("stored_files_reference_idx").on(table.referenced, table.deletedAt) }));

export const workflowTasks = mysqlTable("workflow_tasks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  entityType: varchar("entityType", { length: 80 }).notNull(),
  entityId: varchar("entityId", { length: 80 }).notNull(),
  assigneeId: int("assigneeId"),
  status: mysqlEnum("status", ["open", "in_progress", "done", "cancelled"]).default("open").notNull(),
  dueAt: timestamp("dueAt"),
  lastNotifiedAt: timestamp("lastNotifiedAt"),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ statusIdx: index("workflow_tasks_status_idx").on(table.status), assigneeIdx: index("workflow_tasks_assignee_idx").on(table.assigneeId), taskUidIdx: index("workflow_tasks_task_uid_idx").on(table.scheduleCronTaskUid) }));

export const qcStandards = mysqlTable("qc_standards", {
  id: int("id").autoincrement().primaryKey(),
  beerTypeId: int("beerTypeId").notNull(),
  fieldKey: varchar("fieldKey", { length: 80 }).notNull(),
  label: varchar("label", { length: 160 }).notNull(),
  minValue: decimal("minValue", { precision: 12, scale: 4 }),
  maxValue: decimal("maxValue", { precision: 12, scale: 4 }),
  unit: varchar("unit", { length: 32 }),
  createdBy: int("createdBy"),
}, table => ({ beerFieldIdx: index("qc_standards_beer_field_idx").on(table.beerTypeId, table.fieldKey) }));

export const qcResults = mysqlTable("qc_results", {
  id: int("id").autoincrement().primaryKey(),
  batchId: int("batchId").notNull(),
  fieldKey: varchar("fieldKey", { length: 80 }).notNull(),
  value: decimal("value", { precision: 12, scale: 4 }).notNull(),
  status: mysqlEnum("status", ["pass", "warning", "fail"]).notNull(),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ batchIdx: index("qc_results_batch_idx").on(table.batchId), statusIdx: index("qc_results_status_idx").on(table.status) }));

export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  supplierCode: varchar("supplierCode", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 160 }),
  address: text("address"),
  taxCode: varchar("taxCode", { length: 40 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("suppliers_created_by_idx").on(table.createdBy), nameIdx: index("suppliers_name_idx").on(table.name), statusIdx: index("suppliers_status_idx").on(table.status) }));

export const purchaseOrders = mysqlTable("purchase_orders", {
  id: int("id").autoincrement().primaryKey(),
  purchaseCode: varchar("purchaseCode", { length: 80 }).notNull().unique(),
  supplierId: int("supplierId").notNull(),
  status: mysqlEnum("status", ["draft", "ordered", "partially_received", "received", "cancelled"]).default("draft").notNull(),
  subtotal: decimal("subtotal", { precision: 16, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 16, scale: 2 }).default("0").notNull(),
  expectedAt: timestamp("expectedAt"),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ supplierIdx: index("purchase_orders_supplier_idx").on(table.supplierId), statusIdx: index("purchase_orders_status_idx").on(table.status), ownerIdx: index("purchase_orders_created_by_idx").on(table.createdBy), createdIdx: index("purchase_orders_created_idx").on(table.createdAt) }));

export const purchaseOrderItems = mysqlTable("purchase_order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  ingredientId: int("ingredientId").notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  receivedQuantity: decimal("receivedQuantity", { precision: 12, scale: 2 }).default("0").notNull(),
  unitPrice: decimal("unitPrice", { precision: 16, scale: 2 }).notNull(),
  total: decimal("total", { precision: 16, scale: 2 }).notNull(),
}, table => ({ orderIdx: index("purchase_order_items_order_idx").on(table.orderId), ingredientIdx: index("purchase_order_items_ingredient_idx").on(table.ingredientId) }));

export const financeAccounts = mysqlTable("finance_accounts", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  accountType: mysqlEnum("accountType", ["cash", "bank", "other"]).default("cash").notNull(),
  openingBalance: decimal("openingBalance", { precision: 16, scale: 2 }).default("0").notNull(),
  currentBalance: decimal("currentBalance", { precision: 16, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("finance_accounts_created_by_idx").on(table.createdBy), statusIdx: index("finance_accounts_status_idx").on(table.status) }));

export const financeTransactions = mysqlTable("finance_transactions", {
  id: int("id").autoincrement().primaryKey(),
  transactionCode: varchar("transactionCode", { length: 80 }).notNull().unique(),
  accountId: int("accountId").notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  amount: decimal("amount", { precision: 16, scale: 2 }).notNull(),
  transactionDate: timestamp("transactionDate").notNull(),
  counterparty: varchar("counterparty", { length: 180 }),
  referenceType: varchar("referenceType", { length: 80 }),
  referenceId: int("referenceId"),
  status: mysqlEnum("status", ["draft", "posted", "cancelled"]).default("posted").notNull(),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ accountIdx: index("finance_transactions_account_idx").on(table.accountId), typeDateIdx: index("finance_transactions_type_date_idx").on(table.type, table.transactionDate), statusIdx: index("finance_transactions_status_idx").on(table.status), ownerIdx: index("finance_transactions_created_by_idx").on(table.createdBy) }));

export const receivables = mysqlTable("receivables", {
  id: int("id").autoincrement().primaryKey(),
  documentCode: varchar("documentCode", { length: 80 }).notNull().unique(),
  customerId: int("customerId"),
  orderId: int("orderId"),
  dueDate: timestamp("dueDate"),
  amount: decimal("amount", { precision: 16, scale: 2 }).notNull(),
  paidAmount: decimal("paidAmount", { precision: 16, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["open", "partial", "paid", "cancelled"]).default("open").notNull(),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ customerIdx: index("receivables_customer_idx").on(table.customerId), orderIdx: index("receivables_order_idx").on(table.orderId), statusIdx: index("receivables_status_idx").on(table.status), ownerIdx: index("receivables_created_by_idx").on(table.createdBy) }));

export const payables = mysqlTable("payables", {
  id: int("id").autoincrement().primaryKey(),
  documentCode: varchar("documentCode", { length: 80 }).notNull().unique(),
  supplierName: varchar("supplierName", { length: 180 }).notNull(),
  dueDate: timestamp("dueDate"),
  amount: decimal("amount", { precision: 16, scale: 2 }).notNull(),
  paidAmount: decimal("paidAmount", { precision: 16, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["open", "partial", "paid", "cancelled"]).default("open").notNull(),
  note: text("note"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ supplierIdx: index("payables_supplier_idx").on(table.supplierName), statusIdx: index("payables_status_idx").on(table.status), ownerIdx: index("payables_created_by_idx").on(table.createdBy) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type BeerType = typeof beerTypes.$inferSelect;
export type ProductionBatch = typeof productionBatches.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type SalesOrder = typeof salesOrders.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type WorkflowTask = typeof workflowTasks.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type FinanceAccount = typeof financeAccounts.$inferSelect;
export type FinanceTransaction = typeof financeTransactions.$inferSelect;
export type Receivable = typeof receivables.$inferSelect;
export type Payable = typeof payables.$inferSelect;
export type StoredFile = typeof storedFiles.$inferSelect;
