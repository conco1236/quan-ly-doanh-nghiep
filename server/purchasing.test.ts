import { describe, expect, it } from "vitest";
import { summarizePurchaseOrders } from "./db";

describe("purchasing summaries", () => {
  it("đếm đơn theo trạng thái và tổng giá trị", () => {
    expect(summarizePurchaseOrders([
      { status: "draft", total: "1000000" },
      { status: "ordered", total: 2500000 },
      { status: "partially_received", total: 750000 },
      { status: "received", total: "500000" },
      { status: "cancelled", total: 300000 },
    ])).toEqual({ count: 5, total: 5050000, draft: 1, open: 2, received: 1 });
  });
});
