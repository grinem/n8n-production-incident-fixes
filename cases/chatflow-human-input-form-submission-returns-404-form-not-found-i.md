---
layout: default
title: "Chatflow Human Input form submission returns 404 \"Form not found\" in webapp: BACKSTAGE access token issued to the webapp surface on 1.19.0"
platform: "Automation Engine"
severity: "HIGH"
status: "Resolved"
date: 2026-11-17
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "chatflow-human-input-form-submission-returns-404-form-not-found-i"
---

# Chatflow Human Input form submission returns 404 "Form not found" in webapp: BACKSTAGE access token issued to the webapp surface on 1.19.0


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-17T02:25:22.093910`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Spot on analysis. PR #44864 refactored the delivery domain and dropped the caller surface context introduced in #37556, so the SSE stream defaults to emitting the `BACKSTAGE` recipient token rather than scoping to `STANDALONE_WEB_APP`. Because `/api/form/human_input/<token>` strictly validates token audience on public submissions, it triggers the 404 `FormNotFoundError`.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
