import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("production manual chunk strategy", () => {
  it("keeps chart, admin UI and icon dependency groups explicit", () => {
    const config = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");
    expect(config).toContain('id.includes("/recharts/")');
    expect(config).toContain('return "charts"');
    expect(config).toContain('id.includes("/@radix-ui/")');
    expect(config).toContain('return "admin-ui"');
    expect(config).toContain('id.includes("/lucide-react/")');
    expect(config).toContain('return "ui-icons"');
  });
});
