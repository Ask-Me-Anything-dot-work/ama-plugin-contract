import { describe, it, expect, afterEach } from "vitest";
import { Hono } from "hono";
import { MockBridge } from "../../src/plugin/testing/mock-bridge.js";
import type { IncomingEvent, ConsolePanel } from "../../src/plugin/types.js";

let bridge: MockBridge;

afterEach(() => {
  bridge?.stop();
});

describe("MockBridge event tracking", () => {
  it("tracks submitted events", async () => {
    bridge = new MockBridge();
    const event: IncomingEvent = {
      source: "github",
      type: "issue_mention",
      repo: "org/repo",
      payload: { issue: 42 },
      receivedAt: new Date(),
      deliveryId: "test-delivery",
    };

    await bridge.submitEvent(event);

    expect(bridge.submittedEvents).toHaveLength(1);
    expect(bridge.submittedEvents[0]).toEqual(event);
  });

  it("tracks mounted console panels", () => {
    bridge = new MockBridge();
    const panel: ConsolePanel = {
      id: "test-panel",
      navLabel: "Test",
      icon: "icon",
      mixinUrl: "http://example.com/mixin.js",
      templateUrl: "http://example.com/template.html",
    };

    bridge.mountConsolePanel(panel);

    expect(bridge.mountedPanels).toHaveLength(1);
    expect(bridge.mountedPanels[0]).toEqual(panel);
  });
});

describe("MockBridge server and config", () => {
  it("mountRoutes starts a Hono server on configurable port", async () => {
    bridge = new MockBridge(0);
    const router = new Hono();
    router.get("/test", (c) => c.json({ ok: true }));

    bridge.mountRoutes(router);

    expect(bridge.getPort()).toBe(0);
  });

  it("getConfig returns saved config", async () => {
    bridge = new MockBridge();
    const config = { apiKey: "test-key", retries: 3 };

    await bridge.saveConfig(config);
    const result = await bridge.getConfig<{ apiKey: string; retries: number }>();

    expect(result).toEqual(config);
  });

  it("getConfig returns empty object by default", async () => {
    bridge = new MockBridge();
    const result = await bridge.getConfig<Record<string, unknown>>();

    expect(result).toEqual({});
  });
});

describe("MockBridge logger and migrations", () => {
  it("logger has all methods", () => {
    bridge = new MockBridge();

    expect(typeof bridge.logger.info).toBe("function");
    expect(typeof bridge.logger.warn).toBe("function");
    expect(typeof bridge.logger.error).toBe("function");
    expect(typeof bridge.logger.debug).toBe("function");
  });

  it("runMigrations is a no-op", async () => {
    bridge = new MockBridge();
    await expect(bridge.runMigrations("/tmp/migrations")).resolves.toBeUndefined();
  });
});
