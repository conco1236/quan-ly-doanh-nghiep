import { createHash } from "node:crypto";
import type { Request } from "express";
import { auditLogs } from "../drizzle/schema";
import { getDb } from "./db";

export type RequestMeta = { ipAddress: string; deviceId: string; userAgent: string };

export function getRequestMeta(req: Request): RequestMeta {
  const forwarded = req.headers["x-forwarded-for"];
  const ipAddress = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.ip || req.socket.remoteAddress || "unknown";
  const userAgent = String(req.headers["user-agent"] || "unknown");
  const suppliedDevice = String(req.headers["x-device-id"] || "");
  const deviceId = suppliedDevice || createHash("sha256").update(`${userAgent}|${req.headers["accept-language"] || ""}`).digest("hex").slice(0, 32);
  return { ipAddress, deviceId, userAgent };
}

export async function recordAudit(input: {
  tableName: string;
  recordId: string | number;
  action: "create" | "update" | "delete" | "batch_insert" | "workflow";
  actorId?: number;
  fieldName?: string;
  oldValue?: unknown;
  newValue?: unknown;
  meta: RequestMeta;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditLogs).values({
    tableName: input.tableName,
    recordId: String(input.recordId),
    action: input.action,
    actorId: input.actorId,
    fieldName: input.fieldName,
    oldValue: input.oldValue === undefined ? undefined : JSON.stringify(input.oldValue),
    newValue: input.newValue === undefined ? undefined : JSON.stringify(input.newValue),
    ipAddress: input.meta.ipAddress,
    deviceId: input.meta.deviceId,
    userAgent: input.meta.userAgent,
  });
}
