import { createHash } from "node:crypto";
import type { Request } from "express";
import { auditLogs } from "../drizzle/schema";
import { getDb } from "./db";

export type RequestMeta = { ipAddress: string; deviceId: string; userAgent: string };
export type AccessMode = "full" | "read_only" | "deny";

export function normalizeIp(value: string) { return value.replace(/^::ffff:/, "").trim(); }
export function ipv4ToInt(value: string) { const parts = normalizeIp(value).split(".").map(Number); return parts.length === 4 && parts.every(part => Number.isInteger(part) && part >= 0 && part <= 255) ? parts.reduce((out, part) => (out * 256) + part, 0) >>> 0 : null; }
export function isIpInCidr(ip: string, cidr: string) { const [network, bitsText] = cidr.split("/"); const ipInt = ipv4ToInt(ip); const networkInt = ipv4ToInt(network); const bits = bitsText ? Number(bitsText) : 32; if (ipInt === null || networkInt === null || !Number.isInteger(bits) || bits < 0 || bits > 32) return false; const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0; return (ipInt & mask) === (networkInt & mask); }
export function resolveAccessMode(ip: string, allowedCidrs: string[], outsideMode: "deny" | "read_only" = "read_only"): AccessMode { return allowedCidrs.some(cidr => isIpInCidr(ip, cidr)) ? "full" : outsideMode; }

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
