import { describe, expect, it } from "vitest";
import { evaluateQcValue, resolveQcThresholdForBatch } from "./routers";
import { selectQcStandardForBeerType } from "./db";

describe("QC threshold evaluation", () => {
  it("resolves the standard through batch to beer type and field key", () => {
    const standards = [
      { beerTypeId: 1, fieldKey: "abv", minValue: "4", maxValue: "6" },
      { beerTypeId: 2, fieldKey: "abv", minValue: "6", maxValue: "8" },
    ];
    const batchA = { id: 101, beerTypeId: 1 };
    const batchB = { id: 202, beerTypeId: 2 };
    expect(resolveQcThresholdForBatch(batchA, standards, "abv")?.minValue).toBe("4");
    expect(resolveQcThresholdForBatch(batchB, standards, "abv")?.minValue).toBe("6");
    expect(selectQcStandardForBeerType(standards, 2, "abv")?.maxValue).toBe("8");
  });

  it("returns different pass/fail results for two batches sharing a field key", () => {
    const standards = [
      { beerTypeId: 1, fieldKey: "abv", minValue: "4", maxValue: "6" },
      { beerTypeId: 2, fieldKey: "abv", minValue: "6", maxValue: "8" },
    ];
    const value = 5;
    const standardA = resolveQcThresholdForBatch({ id: 101, beerTypeId: 1 }, standards, "abv");
    const standardB = resolveQcThresholdForBatch({ id: 202, beerTypeId: 2 }, standards, "abv");
    expect(evaluateQcValue(value, Number(standardA?.minValue), Number(standardA?.maxValue))).toBe("pass");
    expect(evaluateQcValue(value, Number(standardB?.minValue), Number(standardB?.maxValue))).toBe("fail");
  });
});
