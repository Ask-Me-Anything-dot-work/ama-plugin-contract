import type { Hono } from "hono";

export interface PluginBridge {
  submitEvent(event: IncomingEvent): Promise<void>;
  mountRoutes(router: Hono): void;
  mountConsolePanel(panel: ConsolePanel): void;
  runMigrations(migrationsDir: string): Promise<void>;
  getConfig<T>(): Promise<T>;
  saveConfig<T>(config: T): Promise<void>;
  logger: Logger;
}

export interface IncomingEvent {
  source: string;
  type: "issue_mention" | "project_status_change" | "push_to_main";
  repo: string;
  actor?: string;
  payload: unknown;
  receivedAt: Date;
  deliveryId: string;
}

export interface OrchestratorPlugin {
  id: string;
  onInstall?(bridge: PluginBridge): Promise<void>;
  onStart(bridge: PluginBridge): Promise<void>;
  onStop(): Promise<void>;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  provides: string[];
}

export interface ConsolePanel {
  id: string;
  navLabel: string;
  icon: string;
  mixinUrl: string;
  templateUrl: string;
}

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}
