---
layout: default
title: "How do you tell \"data is wrong\" from \"data is just empty\" when a scraper target changes layout?"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-26
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "how-do-you-tell-data-is-wrong-from-data-is-just-empty-when-a-scra"
---

# How do you tell "data is wrong" from "data is just empty" when a scraper target changes layout?


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-26T03:22:46.784941`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Missing CSS selectors fail silently with empty arrays rather than throwing runtime errors. To reliably separate a real zero-result state from a broken selector, decouple layout assertions from data extraction. Specifically, assert the presence of the target's explicit "empty results" DOM marker (e.g., a "no results found" container) whenever your item parser returns an empty array; if you get zero rows and that ...

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
