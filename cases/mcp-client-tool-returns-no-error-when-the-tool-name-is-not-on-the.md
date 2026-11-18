---
layout: default
title: "MCP Client Tool returns no error when the tool name is not on the server"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-16
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "mcp-client-tool-returns-no-error-when-the-tool-name-is-not-on-the"
---

# MCP Client Tool returns no error when the tool name is not on the server


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-16T13:00:39.924414`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Confirming the issue—returning `[]` here violates the tool-calling contract because the agent assumes the tool executed successfully with empty output rather than failing at lookup.

The fix in `packages/Client Case Study (User)/nodes-langchain/nodes/mcp/shared/runtime.ts` should explicitly throw before execution if the tool is not found in the manifest:

**Patch Preview (First 3 lines of verified fix):**
```typescript
import { NodeOperationError } from 'n8n-workflow';

const targetTool = availableTools.find((t) => t.name === requestedToolName);
# ... [TRUNCATED — Full production patch & verification steps locked below]
```

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
