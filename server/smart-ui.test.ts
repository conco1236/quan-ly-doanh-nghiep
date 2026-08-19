import { describe, expect, it } from "vitest";
import { inferSmartUiMeta, decorateNavItems } from "../shared/smartUi";

describe("smart UI metadata", () => {
  it("groups brewery operations from Vietnamese keywords", () => {
    expect(inferSmartUiMeta("Quá trình nấu bia")).toMatchObject({ group: "Sản xuất", icon: "factory" });
    expect(inferSmartUiMeta("KCS / QC")).toMatchObject({ group: "KCS / QC", icon: "flask" });
  });

  it("decorates the sidebar configuration consumed by the renderer", () => {
    const items = decorateNavItems([{ id: "inventory", label: "Kho nguyên liệu" }, { id: "production", label: "Quá trình nấu bia" }]);
    expect(items.map(item => item.smart.group)).toEqual(["Kho bãi", "Sản xuất"]);
    expect(items.map(item => item.smart.icon)).toEqual(["boxes", "factory"]);
  });
});
