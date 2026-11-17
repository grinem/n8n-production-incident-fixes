---
layout: default
title: "Chatflow Human Input form submission returns 404 \"Form not found\" in webapp: BACKSTAGE access token issued to the webapp surface on 1.19.0"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-17
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "chatflow-human-input-form-submission-returns-404-form-not-found-i-github"
---

# Chatflow Human Input form submission returns 404 "Form not found" in webapp: BACKSTAGE access token issued to the webapp surface on 1.19.0


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-17T02:20:51.321729`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Confirmed, this is definitely a regression from #44864. The event streamer serializes the recipient tokens into the SSE payload without scoping to the caller surface, falling back to the default ordering where `BACKSTAGE` shadows `STANDALONE_WEB_APP`. Since `/api/form/human_input/{token}` strictly asserts the recipient type matches the entrypoint, it 404s immediately.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
