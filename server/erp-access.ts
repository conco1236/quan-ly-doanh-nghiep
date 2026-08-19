import type { Request } from "express";
import { eq } from "drizzle-orm";
import { accessPolicies } from "../drizzle/schema";
import { getDb } from "./db";
import { getRequestMeta, resolveAccessMode, type AccessMode } from "./erp-security";

export function enforceAccessMode(mode: AccessMode, type: "query" | "mutation" | "subscription") { if (mode === "deny") throw new Error("Truy cập bị từ chối theo chính sách IP"); if (mode === "read_only" && type === "mutation") throw new Error("Ngoài mạng công ty chỉ được xem dữ liệu"); }

export async function loadAccessMode(req: Request): Promise<AccessMode> {
  const db = await getDb();
  if (!db) return "full";
  const policy = (await db.select().from(accessPolicies).where(eq(accessPolicies.enabled, "yes")).limit(1))[0];
  if (!policy) return "full";
  const cidrs = policy.allowedCidrs.split(/[\n,;]+/).map(value => value.trim()).filter(Boolean);
  return resolveAccessMode(getRequestMeta(req).ipAddress, cidrs, policy.outsideMode);
}
