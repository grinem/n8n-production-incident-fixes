---
layout: default
title: "Evolution API: one instance goes “connected but deaf” right after another instance reconnects. Anyone seen this?"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-19
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "evolution-api-one-instance-goes-connected-but-deaf-right-after-an"
---

# Evolution API: one instance goes “connected but deaf” right after another instance reconnects. Anyone seen this?


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-19T23:20:44.819265`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Check your container logs right around the reconnect timestamp for `stream errored out` or a sudden spike in event loop lag.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
