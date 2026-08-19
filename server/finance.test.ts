import { describe, expect, it } from "vitest";
import { summarizeFinanceTransactions, summarizeOutstanding } from "./db";

describe("finance summaries", () => {
  it("tổng hợp thu, chi và dòng tiền ròng, bỏ qua giao dịch đã hủy", () => {
    expect(summarizeFinanceTransactions([
      { type: "income", amount: "1250000", status: "posted" },
      { type: "expense", amount: 250000, status: "posted" },
      { type: "income", amount: 90000, status: "cancelled" },
    ])).toEqual({ income: 1250000, expense: 250000, net: 1000000 });
  });

  it("tính công nợ còn lại không âm và bỏ qua hồ sơ đã hủy", () => {
    expect(summarizeOutstanding([
      { amount: "1000000", paidAmount: "250000" },
      { amount: 800000, paidAmount: 800000, status: "paid" },
      { amount: 500000, paidAmount: 700000 },
      { amount: 900000, paidAmount: 0, status: "cancelled" },
    ])).toBe(750000);
  });
});


describe("costing summaries", () => {
  it("tính chi phí định mức theo đơn giá nhập và bỏ qua nguyên liệu thiếu giá", async () => {
    const { calculateRecipeCost } = await import("./db");
    expect(calculateRecipeCost([
      { beerTypeId: 1, ingredientId: 10, quantity: 2 },
      { beerTypeId: 1, ingredientId: 11, quantity: "1.5" },
      { beerTypeId: 1, ingredientId: 12, quantity: 4 },
    ], new Map([[10, 120000], [11, 80000]]) )).toBe(360000);
  });
});
