# ama-plugin-contract — Architecture & Vision

> Read this before touching #1. This doc exists so an implementing agent
> has everything needed without guessing at conventions or re-deriving
> decisions already made elsewhere in the mesh.

## Why this repo exists

This package is the neutral coordination point between the Orchestrator
core (`ama-agent-orchestrator`) and every plugin that extends it
(connectors, Agent Manager, future console panels). Neither side depends
on the other — both depend only on this package. That property must be
preserved; do not import from `ama-agent-orchestrator` or any specific
plugin repo into this package.

Originally this contract was shipped inside `ama-shared-context`
(see `ama-shared-context#37`, merged via PR #47). It was moved here on
2026-09-10 because `ama-shared-context` is not intended to ever be
open-sourced, while plugin authors — including third parties once the
mesh opens up — need to `npm install` this package publicly. See
`ama-shared-context#182` (closed, folded into this repo's issue #1) for
the full reasoning.

## Conventions to inherit

Do not invent structure. Clone and mirror `ama-mcp-atlassian`
(`Ask-Me-Anything-dot-work/ama-mcp-atlassian`) file-for-file for anything
not covered below — it is the current reference implementation of a
small, standalone, publicly-published `ama-*` TypeScript package:

- `.github/workflows/ci.yml` and `.github/workflows/release.yml` — copy
  these exactly, then adapt only the package name / publish target.
  Read them directly from that repo; do not guess their contents.
- `.releaserc.json` — semantic-release config, copy as-is.
- `commitlint.config.ts`, `eslint.config.js`, `knip.config.js`,
  `tsconfig.json` / `tsconfig.build.json`, `vitest.config.ts` — copy as-is
  unless a concrete reason forces a change.
- `docs/decisions/` — this repo's ADR folder. Per mesh-wide convention,
  any architecturally significant choice made while building this package
  (e.g. how `MockBridge` mounts its Hono server, how `provides` is
  widened) gets an ADR committed here **before** the corresponding code
  lands, not after.
- `agents.md` — carry over the pattern (not the content) from
  `ama-mcp-atlassian/agents.md`: repo-specific instructions for coding
  agents working in this repo.
- `bootstrap.sh` — repo setup script, adapt from the same source.

## The interface, as originally specified (#37)

This is the actual contract to implement — not a paraphrase. Treat this
as the starting point, then apply the #182 extensions below.

```typescript
interface PluginBridge {
  submitEvent(event: IncomingEvent): Promise<void>
  mountRoutes(router: Router): void
  mountConsolePanel(panel: ConsolePanel): void
  runMigrations(migrationsDir: string): Promise<void>
  getConfig<T>(): Promise<T>
  saveConfig<T>(config: T): Promise<void>
  logger: Logger
}

interface IncomingEvent {
  source: string                   // 'github' | 'linear' | 'jira' etc
  type: 'issue_mention' | 'project_status_change' | 'push_to_main'
  repo: string                     // full name e.g. 'org/repo'
  actor?: string
  payload: unknown
  receivedAt: Date
  deliveryId: string               // for deduplication
}

interface OrchestratorPlugin {
  id: string
  onInstall?(bridge: PluginBridge): Promise<void>
  onStart(bridge: PluginBridge): Promise<void>
  onStop(): Promise<void>
}
```

`PluginManifest` mirrored `plugin.json` and originally had
`provides: ('connector')[]` — **this is the field #182 widens**. Do not
ship the closed union; open it up (e.g. `provides: string[]` or a
documented extensible union) so an Agent Manager plugin, or any future
plugin type, can declare a `provides` value without a breaking change to
this package.

## What #182 adds on top

- **`ConsolePanel` type**, referenced but never typed in the original
  `PluginBridge.mountConsolePanel(panel: ConsolePanel)`:
  ```typescript
  interface ConsolePanel {
    id: string
    navLabel: string
    icon: string
    mixinUrl: string
    templateUrl: string
  }
  ```
- **Generic `provides`** as described above.
- **`MockBridge` updates**: add assertion support for `mountConsolePanel`
  calls, following the same pattern as the existing `submittedEvents`
  assertion array (i.e. expose something like
  `mountedPanels: ConsolePanel[]` on the mock).

## Breaking-change policy (from #37, still binding)

Any change to these interfaces is a semver **major** bump. Add a
CHANGELOG entry with a migration note. This package is meant to be the
boring, stable thing plugins pin a semver range against — treat
instability here as a cost imposed on every downstream plugin author, not
just this repo.

## Downstream consumers to keep in mind

- `ama-agent-orchestrator#264` — the plugin host; the first real
  consumer of `PluginBridge`/`OrchestratorPlugin`.
- `create-ama-plugin#1` — the scaffold repo; pins this package as a
  semver-ranged public npm dependency and generates a stub
  `OrchestratorPlugin` wired to these types.
- Agent Manager (planned) — will be the first plugin to actually need a
  non-`'connector'` `provides` value, validating the widened type.

## Parent milestone

`ama-shared-context#181`.
