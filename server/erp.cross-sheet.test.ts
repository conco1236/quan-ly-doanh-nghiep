import { describe, expect, it } from "vitest";
import { crossSheetTargetTables, getCrossSheetLinks } from "./db";

describe("cross-sheet relation mapping", () => {
  it("maps sales orders to customer and order records", () => {
    expect(crossSheetTargetTables("sales_orders")).toEqual(["customers", "sales_orders", "sales_order_items"]);
  });

  it("maps production batches to beer, recipe and QC records", () => {
    expect(crossSheetTargetTables("production_batches")).toContain("beer_types");
    expect(crossSheetTargetTables("production_batches")).toContain("qc_results");
  });

  it("maps beer types and ingredients to their related records", () => {
    expect(crossSheetTargetTables("beer_types")).toEqual(["beer_types", "recipes", "production_batches"]);
    expect(crossSheetTargetTables("ingredients")).toEqual(["ingredients", "inventory_transactions"]);
  });

  it("returns a safe empty resolver result without a database", async () => {
    const result = await getCrossSheetLinks({ tableName: "ingredients", recordId: 1 });
    expect(result.source).toBeNull();
    expect(result.inventoryTransactions).toEqual([]);
  });
});
