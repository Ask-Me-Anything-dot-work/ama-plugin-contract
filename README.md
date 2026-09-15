# @ama-work/plugin-contract

Neutral TypeScript contract package shared between the Orchestrator core (`ama-agent-orchestrator`) and all mesh plugins.

## Purpose

This package defines the interface boundary between the Orchestrator and plugins. Neither side depends on the other — both depend only on this package. This property must be preserved; do not import from `ama-agent-orchestrator` or any specific plugin repo.

## Install

```bash
bun add @ama-work/plugin-contract
# or
npm install @ama-work/plugin-contract
```

## Exported Types

```typescript
import {
  PluginBridge,
  IncomingEvent,
  PluginManifest,
  ConsolePanel,
  OrchestratorPlugin,
  Logger,
} from "@ama-work/plugin-contract";
```

### PluginBridge

The interface plugins use to interact with the orchestrator. Implement `PluginBridge` to receive events, mount routes, and manage config.

### PluginManifest

Plugin metadata. The `provides` field is `string[]` (open type) — any plugin can declare arbitrary capability strings without requiring changes to this contract.

```typescript
const manifest: PluginManifest = {
  id: "my-plugin",
  name: "My Plugin",
  version: "1.0.0",
  provides: ["connector", "custom-thing"],
};
```

### ConsolePanel

Console panel descriptor for UI integration:

```typescript
interface ConsolePanel {
  id: string;
  navLabel: string;
  icon: string;
  mixinUrl: string;
  templateUrl: string;
}
```

### OrchestratorPlugin

Plugin lifecycle hooks:

```typescript
interface OrchestratorPlugin {
  id: string;
  onInstall?(bridge: PluginBridge): Promise<void>;
  onStart(bridge: PluginBridge): Promise<void>;
  onStop(): Promise<void>;
}
```

## Testing with MockBridge

```typescript
import { MockBridge } from "@ama-work/plugin-contract/testing";
```

`MockBridge` is a full in-memory `PluginBridge` implementation for unit tests:

- `submittedEvents` — array of events submitted via `submitEvent()`
- `mountedPanels` — array of panels mounted via `mountConsolePanel()`
- `mountRoutes(router)` — starts a local Hono server on configurable port
- `getConfig()` / `saveConfig()` — round-trips in memory
- All other methods are no-op stubs

## Versioning Policy

Any change to the exported interfaces is a **semver major** bump. This package is the stable dependency point for all downstream plugins — treat instability as a cost imposed on every plugin author.

## License

MIT
