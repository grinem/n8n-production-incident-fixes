---
layout: default
title: "Facebook Pages OAuth requires a Page-list permission missing from consent"
platform: "Make.com"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-20
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "facebook-pages-oauth-requires-a-page-list-permission-missing-from"
---

# Facebook Pages OAuth requires a Page-list permission missing from consent


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-20T10:40:51.725276`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Meta strips the `pages_show_list` scope whenever you try to cherry-pick pages inside the OAuth consent modal. Make relies on that scope to enumerate your accounts and retrieve the page access token, which is why it drops out with "No access token specified".

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
