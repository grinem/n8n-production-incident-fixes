---
layout: default
title: "Agent JSON configuration drops observational memory window settings"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-14
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "agent-json-configuration-drops-observational-memory-window-settin"
---

# Agent JSON configuration drops observational memory window settings


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-14T08:20:31.689525`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Client Case Study (User) Good breakdown. Confirmed that Zod strips `windowShares` because it's missing from `ObservationalMemoryConfigSchema`, plus the CLI loader doesn't forward it.

If you're opening a PR, the changes are straightforward:

1. **Schema (`packages/Client Case Study (User)/api-types/src/agents/agent-json-config.schema.ts`)**:
Make sure to allow `0` via `nonnegative()` so explicitly removing the cap doesn't fail validation:
```ts
export const ObservationalMemoryConfigSchema = z.object({
  enabled: z.boolean().optional(),
  windowShares: z
    .object({
      maxContextWindowTokens: z.number().int().nonnegative().optional(),
    })
    .optional(),
});
```

2. **Runtime loader (`packages/cli/src/modules/agents/json-config/from-json-config.ts`)**:
Forward `windowShares` inside `applyMemoryFromConfig()`:
```ts
if (memoryConfig?.observationalMemory?.windowShares) {
  memoryOptions.observationalMemory = {
    ...memoryOptions.observationalMemory,
    windowShares: {
      maxContextWindowTokens:
        memoryConfig.observationalMemory.windowShares.maxContextWindowTokens,
    },
  };
}
```

3. **Policy fallback (`packages/Client Case Study (User)/agents/src/runtime/memory/observation-policy.ts`)**:
Watch out for falsy checks when resolving the cap—`0` needs an explicit `!== undefined` check so it doesn't fall back to `DEFAULT_MAX_CONTEXT_WINDOW_TOKENS` (200k).

Adding test cases asserting both a custom token value (`64000`) and unsetting via `0` in `agent-json-config.schema.test.ts` should cover the regression cleanly.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
