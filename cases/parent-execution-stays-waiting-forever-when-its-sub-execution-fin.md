---
layout: default
title: "Parent execution stays `waiting` forever when its sub-execution finishes during the parked-parent sweep and the child's row is already deleted"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-21
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "parent-execution-stays-waiting-forever-when-its-sub-execution-fin"
---

# Parent execution stays `waiting` forever when its sub-execution finishes during the parked-parent sweep and the child's row is already deleted


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-21T17:40:52.456874`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Until this is patched upstream, the immediate unblocker is setting `saveDataSuccessExecution: "all"` on the child workflow and relying on global `EXECUTIONS_DATA_PRUNE=true` (with a short `EXECUTIONS_DATA_MAX_AGE`) so the row survives long enough for the sweep to resolve.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
