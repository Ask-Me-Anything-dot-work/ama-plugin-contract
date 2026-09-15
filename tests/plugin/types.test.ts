import { describe, it, expect } from "vitest";
import type {
  PluginBridge,
  IncomingEvent,
  OrchestratorPlugin,
  PluginManifest,
  ConsolePanel,
  Logger,
} from "../../src/plugin/types.js";
import { MockBridge } from "../../src/plugin/testing/mock-bridge.js";

describe("PluginBridge interface", () => {
  it("accepts a full implementation", () => {
    const bridge: PluginBridge = new MockBridge();
    expect(bridge.submitEvent).toBeDefined();
    expect(bridge.mountRoutes).toBeDefined();
    expect(bridge.mountConsolePanel).toBeDefined();
    expect(bridge.runMigrations).toBeDefined();
    expect(bridge.getConfig).toBeDefined();
    expect(bridge.saveConfig).toBeDefined();
    expect(bridge.logger).toBeDefined();
  });
});

describe("PluginManifest.provides", () => {
  it("accepts arbitrary string array", () => {
    const manifest: PluginManifest = {
      id: "test",
      name: "Test",
      version: "1.0.0",
      provides: ["connector", "agent-manager", "custom-thing"],
    };
    expect(manifest.provides).toHaveLength(3);
  });
});

describe("ConsolePanel shape", () => {
  it("has required fields", () => {
    const panel: ConsolePanel = {
      id: "test-panel",
      navLabel: "Test",
      icon: "test-icon",
      mixinUrl: "http://example.com/mixin.js",
      templateUrl: "http://example.com/template.html",
    };
    expect(panel.id).toBe("test-panel");
    expect(panel.navLabel).toBe("Test");
    expect(panel.icon).toBe("test-icon");
    expect(panel.mixinUrl).toBe("http://example.com/mixin.js");
    expect(panel.templateUrl).toBe("http://example.com/template.html");
  });
});

describe("Logger interface", () => {
  it("has all log methods", () => {
    const logger: Logger = {
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    };
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });
});

describe("IncomingEvent shape", () => {
  it("has required fields", () => {
    const event: IncomingEvent = {
      source: "github",
      type: "issue_mention",
      repo: "org/repo",
      payload: {},
      receivedAt: new Date(),
      deliveryId: "abc-123",
    };
    expect(event.source).toBe("github");
    expect(event.type).toBe("issue_mention");
    expect(event.repo).toBe("org/repo");
    expect(event.deliveryId).toBe("abc-123");
  });

  it("allows optional actor", () => {
    const event: IncomingEvent = {
      source: "github",
      type: "push_to_main",
      repo: "org/repo",
      actor: "user1",
      payload: { commits: [] },
      receivedAt: new Date(),
      deliveryId: "def-456",
    };
    expect(event.actor).toBe("user1");
  });
});

describe("OrchestratorPlugin shape", () => {
  it("has required fields and optional onInstall", () => {
    const plugin: OrchestratorPlugin = {
      id: "test-plugin",
      onStart: async () => {},
      onStop: async () => {},
    };
    expect(plugin.id).toBe("test-plugin");
    expect(plugin.onInstall).toBeUndefined();
    expect(typeof plugin.onStart).toBe("function");
    expect(typeof plugin.onStop).toBe("function");
  });
});
