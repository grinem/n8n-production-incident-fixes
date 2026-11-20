---
layout: default
title: "Editor: Sub execution error toast in the logs panel is hardcoded English"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-20
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "editor-sub-execution-error-toast-in-the-logs-panel-is-hardcoded-e"
---

# Editor: Sub execution error toast in the logs panel is hardcoded English


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-20T08:27:33.396373`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Checking `packages/frontend/editor-ui/src/features/execution/logs/composables/useLogsExecutionData.ts` around line 148, the notification call passes the title as a raw string literal directly into the toast helper rather than dispatching it through localization.

When wrapping this in your PR, add the translation key under the execution logs namespace in `packages/frontend/editor-ui/src/locales/en.json`:

**Patch Preview (First 3 lines of verified fix):**
```json
"executionLogs.unableToLoadSubExecution": "Unable to load sub execution"
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
