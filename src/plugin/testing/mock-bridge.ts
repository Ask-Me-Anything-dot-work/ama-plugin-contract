import { Hono } from "hono";
import { serve } from "@hono/node-server";
import type {
  PluginBridge,
  IncomingEvent,
  ConsolePanel,
  Logger,
} from "../types.js";

export class MockBridge implements PluginBridge {
  readonly submittedEvents: IncomingEvent[] = [];
  readonly mountedPanels: ConsolePanel[] = [];

  private config: Record<string, unknown> = {};
  private server: ReturnType<typeof serve> | null = null;
  private port: number;

  readonly logger: Logger = {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  };

  constructor(port = 0) {
    this.port = port;
  }

  async submitEvent(event: IncomingEvent): Promise<void> {
    this.submittedEvents.push(event);
  }

  mountRoutes(router: Hono): void {
    this.server = serve({ fetch: router.fetch, port: this.port });
  }

  mountConsolePanel(panel: ConsolePanel): void {
    this.mountedPanels.push(panel);
  }

  async runMigrations(_migrationsDir: string): Promise<void> {}

  async getConfig<T>(): Promise<T> {
    return this.config as T;
  }

  async saveConfig<T>(config: T): Promise<void> {
    this.config = config as Record<string, unknown>;
  }

  getPort(): number {
    return this.port;
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}
