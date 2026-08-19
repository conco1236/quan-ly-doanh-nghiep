export type StorageRecord = { key: string; referenced: boolean; createdAt: Date; deletedAt?: Date | null };

/** Không renumber khóa lịch sử; ID mới luôn do database auto-increment cấp. */
export function nextIdStrategy() { return { mode: "database_auto_increment" as const, complexity: "O(1)" as const, renumberExisting: false } as const; }

/** Chỉ chọn object mồ côi quá hạn; thao tác xóa thật phải do storage adapter thực hiện idempotently. */
export function selectOrphanedStorageKeys(records: StorageRecord[], olderThan: Date) { return records.filter(record => !record.referenced && !record.deletedAt && record.key.length > 0 && record.createdAt < olderThan).map(record => record.key); }
export async function cleanupStoredFileMetadata(records: StorageRecord[], olderThan: Date, deleteKeys: (keys: string[]) => Promise<void>) { const keys = selectOrphanedStorageKeys(records, olderThan); if (keys.length) await deleteKeys(keys); return keys; }
