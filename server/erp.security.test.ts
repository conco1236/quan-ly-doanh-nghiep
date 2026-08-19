import { describe, expect, it } from "vitest";
import { isIpInCidr, resolveAccessMode } from "./erp-security";
import { enforceAccessMode } from "./erp-access";

describe("application IP access policy", () => {
  it("matches a company CIDR", () => {
    expect(isIpInCidr("10.10.4.22", "10.10.0.0/16")).toBe(true);
    expect(isIpInCidr("10.11.4.22", "10.10.0.0/16")).toBe(false);
  });
  it("enforces mode for queries and mutations", () => {
    expect(() => enforceAccessMode("deny", "query")).toThrow();
    expect(() => enforceAccessMode("read_only", "mutation")).toThrow();
    expect(() => enforceAccessMode("read_only", "query")).not.toThrow();
    expect(() => enforceAccessMode("full", "mutation")).not.toThrow();
  });

  it("resolves outside access mode", () => {
    expect(resolveAccessMode("10.10.4.22", ["10.10.0.0/16"])).toBe("full");
    expect(resolveAccessMode("203.0.113.9", ["10.10.0.0/16"], "read_only")).toBe("read_only");
    expect(resolveAccessMode("203.0.113.9", ["10.10.0.0/16"], "deny")).toBe("deny");
  });
});
