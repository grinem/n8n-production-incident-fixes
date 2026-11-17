---
layout: default
title: "Agents omit HTTP status from MCP warnings and tool errors"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-17
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "agents-omit-http-status-from-mcp-warnings-and-tool-errors"
---

# Agents omit HTTP status from MCP warnings and tool errors


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-17T04:21:07.727474`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Confirmed on master. The transport error preserves `code`/`status`, but stringifying via `error.message` drops it before reaching `getConnectionFailures()` and `ToolCallRunner`.

To guard against collisions with JSON-RPC error codes (`-32xxx`) or SSE disconnects (`-1`), a quick range check in `Client Case Study (User)/agents` before formatting does the trick:

**Patch Preview (First 3 lines of verified fix):**
```typescript
const status = (error as { status?: unknown; code?: unknown })?.status
  ?? (error as { code?: unknown })?.code;

# ... [TRUNCATED — Full production patch & verification steps locked below]
```

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
