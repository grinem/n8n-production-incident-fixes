---
layout: default
title: "Regression in 2.46.0: $('Node').first() returns null for a node's error output in webhook executions (fixed by N8N_EXPRESSION_ENGINE=legacy)"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-18
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "regression-in-2-46-0-node-first-returns-null-for-a-node-s-error-o"
---

# Regression in 2.46.0: $('Node').first() returns null for a node's error output in webhook executions (fixed by N8N_EXPRESSION_ENGINE=legacy)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-18T07:30:12.759634`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The `#<Object> could not be cloned` error confirms the root cause: the v2 expression engine evaluates webhook expressions inside an isolated V8 context, and the raw `Error` instance on `continueErrorOutput` fails structured cloning across the isolate boundary when accessed historically via `$('Node')`.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
