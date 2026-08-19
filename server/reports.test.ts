import { describe, expect, it } from "vitest";
import { summarizeInventoryRows, summarizeProductionSteps } from "./db";

describe("production report step aggregation", () => {
  it("groups step types and counts each workflow status", () => {
    expect(summarizeProductionSteps([
      { stepType: "mashing", status: "completed" },
      { stepType: "mashing", status: "in_progress" },
      { stepType: "fermentation", status: "pending" },
      { stepType: "fermentation", status: "completed" },
      { stepType: "bottling", status: "completed" },
    ])).toEqual([
      { stepType: "mashing", total: 2, pending: 0, inProgress: 1, completed: 1 },
      { stepType: "fermentation", total: 2, pending: 1, inProgress: 0, completed: 1 },
      { stepType: "bottling", total: 1, pending: 0, inProgress: 0, completed: 1 },
    ]);
  });
});

describe("inventory report aggregation", () => {
  it("calculates stock alerts and daily inbound/outbound movements", () => {
    const result = summarizeInventoryRows([
      { id: 1, name: "Malt", unit: "kg", stockQuantity: "80", lowStockThreshold: "100" },
      { id: 2, name: "Hoa bia", unit: "kg", stockQuantity: "250", lowStockThreshold: "100" },
    ], [
      { type: "in", quantity: "120", createdAt: new Date("2026-08-01T08:00:00Z") },
      { type: "out", quantity: "20", createdAt: new Date("2026-08-01T12:00:00Z") },
    ]);
    expect(result.totalItems).toBe(2);
    expect(result.totalStock).toBe(330);
    expect(result.lowStockCount).toBe(1);
    expect(result.movementsByDay).toEqual([{ date: "2026-08-01", inbound: 120, outbound: 20 }]);
  });
});
