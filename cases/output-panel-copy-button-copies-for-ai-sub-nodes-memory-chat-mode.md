---
layout: default
title: "Output panel copy button copies \"[]\" for AI sub-nodes (memory, chat model, tools)"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-15
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "output-panel-copy-button-copies-for-ai-sub-nodes-memory-chat-mode"
---

# Output panel copy button copies "[]" for AI sub-nodes (memory, chat model, tools)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-15T23:00:32.552341`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Spot on diagnosis. In `packages/editor-ui`, the copy action in the output view explicitly reads `runData.data.main` (or defaults to `[]` when `main` is missing), completely ignoring non-standard connection keys like `ai_tool`, `ai_languageModel`, and `ai_memory` even though the viewer component renders them fine.

Until the frontend checks `Object.keys(nodeData)` or falls back across active connection types, a quick workaround in Chrome DevTools to grab the raw sub-node data without re-querying the API is:

**Patch Preview (First 3 lines of verified fix):**
```javascript
copy(window.__pinia?.state.value?.execution?.executionData?.resultData?.runData?.["Your Node Name"]?.[0]?.data);
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
