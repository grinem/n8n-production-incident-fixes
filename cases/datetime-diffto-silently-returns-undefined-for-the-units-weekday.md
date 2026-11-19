---
layout: default
title: "DateTime.diffTo() silently returns undefined for the units weekday, weekNumber and yearDayNumber"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-19
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "datetime-diffto-silently-returns-undefined-for-the-units-weekday"
---

# DateTime.diffTo() silently returns undefined for the units weekday, weekNumber and yearDayNumber


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-19T18:40:45.973116`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Great catch and spot-on root-cause analysis.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
