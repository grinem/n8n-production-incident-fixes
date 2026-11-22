---
layout: default
title: "Webhook Allowed Origins (CORS) entries after the first are broken when the list contains spaces"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-22
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "webhook-allowed-origins-cors-entries-after-the-first-are-broken-w"
---

# Webhook Allowed Origins (CORS) entries after the first are broken when the list contains spaces


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-22T06:20:47.968577`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Confirmed on master. The origins string is parsed via `.split(',')` without trimming elements, leaving subsequent entries with a leading space that fails strict equality against incoming `Origin` headers (falling back to returning the first entry).

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
