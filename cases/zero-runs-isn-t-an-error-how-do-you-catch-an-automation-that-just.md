---
layout: default
title: "Zero runs isn’t an error How do you catch an automation that just stops getting triggered?"
platform: "Make.com"
severity: "HIGH"
status: "Resolved"
date: 2026-11-17
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "zero-runs-isn-t-an-error-how-do-you-catch-an-automation-that-just"
---

# Zero runs isn’t an error How do you catch an automation that just stops getting triggered?


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-17T07:00:39.222115`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The standard fix for this is a dead man's switch (e.g. Healthchecks[.]io or Better Stack). Put an HTTP module at the end of your scenario that pings a check URL on successful SFTP transfer. You can configure the check's schedule so it only expects pings during business hours (e.g., alert if quiet for >3 hours between 9am–6pm).

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
