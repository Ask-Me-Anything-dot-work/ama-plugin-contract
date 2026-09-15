import { describe, it, expect } from "vitest";

describe("package exports", () => {
  it("exports MockBridge", async () => {
    const mod = await import("../../src/index.js");
    expect(mod.MockBridge).toBeDefined();
  });
});
