# Agent Context — ama-plugin-contract

This document gives a dev agent everything needed to implement issues in this repo without prior project knowledge.

## What this repo is

A neutral TypeScript contract package (`@ama-work/plugin-contract`) that both the Orchestrator core (`ama-agent-orchestrator`) and all mesh plugins depend on. Neither side imports from the other — both depend only on this package.

**Do not** import from `ama-agent-orchestrator` or any specific plugin repo into this package. This package is the coordination boundary.

## Exported types

- `PluginBridge` — the interface plugins use to interact with the orchestrator
- `IncomingEvent` — event payload delivered to plugins
- `PluginManifest` — plugin metadata with generic `provides: string[]`
- `ConsolePanel` — console panel descriptor for UI integration
- `OrchestratorPlugin` — plugin lifecycle hooks
- `Logger` — minimal logging interface

## Testing

- `MockBridge` — full in-memory `PluginBridge` implementation for unit tests
  - Tracks `submittedEvents` and `mountedPanels` for assertions
  - `mountRoutes` spins up a local Hono server on configurable port
  - All methods are no-op stubs except config (round-trips in memory)

## Commands

```bash
bun install          # install dependencies
bun tsc --noEmit     # typecheck
bun knip             # unused export check
bun eslint .         # lint
bun run test         # run tests
bun run lint         # full lint (tsc + knip + eslint)
```

## Conventions

- Single responsibility per file (service/repository/util pattern)
- Files max 150 lines, functions max 50 lines
- Semver major for any interface change (breaking-change policy from `#37`)
- ADRs in `docs/decisions/` for architecturally significant choices
- This repo publishes to public npm as `@ama-work/plugin-contract`
