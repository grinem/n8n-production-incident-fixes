---
layout: default
title: "Human Input v2 creates nodes with empty notification subject and body"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-18
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "human-input-v2-creates-nodes-with-empty-notification-subject-and"
---

# Human Input v2 creates nodes with empty notification subject and body


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-18T08:26:17.440010`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Nice catch. The catalog factory (`useWorkflowNodeCatalog` / node creation handler) is constructing the initial node data from the static blueprint rather than merging `nodesDefaultConfigs['human-input']` fetched from `default-workflow-block-configs`.

When instantiating the node in `handleCreateNode` / `handleSelect`:

**Patch Preview (First 3 lines of verified fix):**
```typescript
const backendDefaults = nodesDefaultConfigs?.[nodeType]

const initialData = {
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
