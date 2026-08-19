import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { sdk } from "./sdk";
import { getDb, cleanupOrphanedStoredFiles, getWorkflowAlerts } from "../db";
import { workflowTasks } from "../../drizzle/schema";
import { and, eq, or } from "drizzle-orm";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.post("/api/scheduled/storage-cleanup", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user.isCron) return res.status(403).json({ error: "cron-only" });
      const olderThan = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const result = await cleanupOrphanedStoredFiles(olderThan);
      return res.json({ ok: true, ...result });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : "storage-cleanup-failed", timestamp: new Date().toISOString() });
    }
  });
  app.post("/api/scheduled/workflow-alert-scan", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user.isCron) return res.status(403).json({ error: "cron-only" });
      const db = await getDb();
      if (!db) return res.status(503).json({ error: "database-unavailable" });
      const alerts = await getWorkflowAlerts();
      const candidates = [
        ...alerts.lowStock.map(row => ({ entityType: "low_stock", entityId: String(row.id), title: `Tồn kho thấp: ${row.name}`, description: `Tồn ${row.stockQuantity} ${row.unit}, ngưỡng ${row.lowStockThreshold} ${row.unit}` })),
        ...alerts.overdueMaintenance.map(row => ({ entityType: "maintenance_overdue", entityId: String(row.id), title: `Bảo trì quá hạn: ${row.title}`, description: `Lịch bảo dưỡng đã quá hạn từ ${new Date(row.nextDueAt).toISOString()}` })),
        ...alerts.pendingLeaves.map(row => ({ entityType: "leave_pending", entityId: String(row.id), title: `Đơn nghỉ chờ duyệt #${row.id}`, description: `Nhân viên #${row.employeeId} xin nghỉ ${row.totalDays} ngày` })),
      ];
      let created = 0;
      for (const item of candidates) {
        const existing = (await db.select({ id: workflowTasks.id }).from(workflowTasks).where(and(eq(workflowTasks.entityType, item.entityType), eq(workflowTasks.entityId, item.entityId), or(eq(workflowTasks.status, "open"), eq(workflowTasks.status, "in_progress")))).limit(1))[0];
        if (!existing) { await db.insert(workflowTasks).values({ ...item, status: "open", createdBy: null }); created += 1; }
      }
      return res.json({ ok: true, scanned: candidates.length, created, alerts: { lowStock: alerts.lowStockCount, overdueMaintenance: alerts.overdueMaintenanceCount, pendingLeaves: alerts.pendingLeaveCount } });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : "workflow-alert-scan-failed", timestamp: new Date().toISOString() });
    }
  });
  app.post("/api/scheduled/workflow-reminders", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
      const db = await getDb();
      if (!db) return res.status(503).json({ error: "database-unavailable" });
      const task = (await db.select().from(workflowTasks).where(eq(workflowTasks.scheduleCronTaskUid, user.taskUid)).limit(1))[0];
      if (!task) return res.json({ ok: true, skipped: "orphan" });
      if (["done", "cancelled"].includes(task.status)) return res.json({ ok: true, skipped: task.status });
      await db.update(workflowTasks).set({ lastNotifiedAt: new Date() }).where(eq(workflowTasks.id, task.id));
      return res.json({ ok: true, taskId: task.id, status: task.status });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : "workflow-reminder-failed", timestamp: new Date().toISOString() });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
