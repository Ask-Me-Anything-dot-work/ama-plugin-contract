# Changelog

## 1.0.0 (2026-09-15)

### ⚠ BREAKING CHANGES

- **provides:** `PluginManifest.provides` changed from `('connector')[]` to `string[]`. Any code that type-checks against the old closed union will need to update type annotations. Runtime behavior is unchanged.

### Features

- Initial release of `@ama-work/plugin-contract`
- `PluginBridge` interface for orchestrator-plugin communication
- `IncomingEvent` type for event delivery
- `PluginManifest` with generic `provides: string[]`
- `ConsolePanel` type for UI integration
- `OrchestratorPlugin` lifecycle hooks
- `Logger` interface
- `MockBridge` full in-memory implementation for testing
- Hono-based `mountRoutes` with configurable port
- Submitted events and mounted panels assertion support

### Notes

- Supersedes types previously in `ama-shared-context#37`
- Relocated from `ama-shared-context` for public npm publishability
