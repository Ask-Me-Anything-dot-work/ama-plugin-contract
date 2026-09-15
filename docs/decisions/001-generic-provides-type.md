# ADR-001: Generic `provides` Type in PluginManifest

**Status:** accepted
**Date:** 2026-09-15

## Context

The original `PluginManifest` interface (shipped in `ama-shared-context#37`) defined `provides` as a closed union:

```typescript
provides: ('connector')[]
```

This worked when the only plugin type was a connector. The mesh now plans additional plugin types — Agent Manager, future console panels, and potentially others. A closed union forces a breaking change to this package every time a new plugin type is added.

## Decision

`PluginManifest.provides` is `string[]` (open type), not a closed union. Any plugin can declare arbitrary capability strings without requiring changes to this contract package.

## Consequences

- **Easier:** New plugin types (Agent Manager, etc.) can declare `provides` values without a semver major bump to this package.
- **Harder:** No compile-time exhaustiveness check on plugin types. Plugin authors must self-document valid values.
- **Trade-off accepted:** Runtime flexibility and extensibility over compile-time safety. Downstream consumers (`create-ama-plugin`) can provide their own type aliases if stricter typing is needed locally.
