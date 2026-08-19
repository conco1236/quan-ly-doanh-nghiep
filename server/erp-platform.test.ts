import { describe, expect, it } from "vitest";
import { cleanupStoredFileMetadata, nextIdStrategy, selectOrphanedStorageKeys } from "./erp-platform";

describe("platform safety helpers", () => {
  it("keeps database IDs O(1) without renumbering history", () => {
    expect(nextIdStrategy()).toEqual({ mode: "database_auto_increment", complexity: "O(1)", renumberExisting: false });
  });
  it("selects only unreferenced old storage records", () => {
    const old = new Date("2025-01-01T00:00:00Z");
    const records = [
      { key: "old-orphan", referenced: false, createdAt: new Date("2024-01-01T00:00:00Z") },
      { key: "new-orphan", referenced: false, createdAt: new Date("2026-01-01T00:00:00Z") },
      { key: "old-used", referenced: true, createdAt: new Date("2024-01-01T00:00:00Z") },
    ];
    expect(selectOrphanedStorageKeys(records, old)).toEqual(["old-orphan"]);
    expect(selectOrphanedStorageKeys(records.filter(record => record.key !== "old-orphan"), old)).toEqual([]);
  });

  it("runs cleanup idempotently and skips referenced records", async () => {
    const deleted: string[][] = [];
    const records = [{ key: "orphan", referenced: false, createdAt: new Date("2024-01-01T00:00:00Z") }, { key: "used", referenced: true, createdAt: new Date("2024-01-01T00:00:00Z") }];
    const first = await cleanupStoredFileMetadata(records, new Date("2025-01-01T00:00:00Z"), async keys => { deleted.push(keys); });
    const second = await cleanupStoredFileMetadata(records.filter(record => !first.includes(record.key)), new Date("2025-01-01T00:00:00Z"), async keys => { deleted.push(keys); });
    expect(first).toEqual(["orphan"]);
    expect(second).toEqual([]);
    expect(deleted).toEqual([["orphan"]]);
  });
});
