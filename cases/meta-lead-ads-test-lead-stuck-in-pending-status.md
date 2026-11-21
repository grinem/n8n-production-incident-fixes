---
layout: default
title: "Meta Lead Ads test lead stuck in Pending status"
platform: "Meta / Webhooks"
severity: "HIGH"
status: "Resolved"
date: 2026-11-11
tags: ["meta / webhooks", "production-fix", "post-mortem", "verified-resolution"]
slug: "meta-lead-ads-test-lead-stuck-in-pending-status"
---

# Meta Lead Ads test lead stuck in Pending status


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Meta / Webhooks`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T13:40:18.228840`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The dashboard "Send to My Server" button bypasses the Page pipeline entirely. The Facebook Page itself must be subscribed to `leadgen` using a Page Access Token with `pages_manage_metadata`, `leads_retrieval`, and `pages_read_engagement`:

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
