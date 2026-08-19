import { describe, expect, it, vi } from "vitest";
import { buildStoredFileMetadata, persistStoredFileMetadata, storagePut } from "./storage";

describe("stored file metadata", () => {
  it("builds an unreferenced upload record", () => {
    expect(buildStoredFileMetadata("users/9/report.pdf", { ownerId: 9 })).toEqual({ storageKey: "users/9/report.pdf", ownerId: 9, referenced: "no" });
  });
  it("marks referenced uploads", () => {
    expect(buildStoredFileMetadata("public/logo.svg", { referenced: true })).toMatchObject({ referenced: "yes" });
  });
  it("persists metadata through the DB insert contract", async () => {
    const values = vi.fn().mockResolvedValue({});
    const db = { insert: vi.fn().mockReturnValue({ values }) };
    await persistStoredFileMetadata(db, buildStoredFileMetadata("users/9/db-default.pdf", { ownerId: 9 }));
    expect(db.insert).toHaveBeenCalled();
    expect(values).toHaveBeenCalledWith(expect.objectContaining({ storageKey: "users/9/db-default.pdf", ownerId: 9 }));
  });

  it("persists metadata after a successful upload", async () => {
    const sink = vi.fn().mockResolvedValue(undefined);
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ url: "https://s3.test/presigned" }) })
      .mockResolvedValueOnce({ ok: true });
    const result = await storagePut("users/9/report.pdf", "data", "application/pdf", { ownerId: 9, metadataSink: sink, fetchImpl });
    expect(result.url).toContain("/manus-storage/");
    expect(sink).toHaveBeenCalledWith(expect.objectContaining({ ownerId: 9, referenced: "no" }));
  });
});
