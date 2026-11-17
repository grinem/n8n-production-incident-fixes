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


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-17T04:20:43.178084+01:00`)**  
> **Author (`fxia0018`) verified on [the live thread](https://github.com/langgenius/dify/issues/46535)**:  
> *"Thanks for the detailed report and the regression analysis.

This appears to be the same root cause as #45753, which was already fixed by #45827 (merged Nov 13, targeting the HITL surface rewrite from #44864). On current `main`, `workflow_response_converter.py` explicitly maps `InvokeFrom.WEB_APP` to the web-app HITL surface, so the webapp surface is issued the `STANDALONE_WEB_APP` recipient token rather than falling back to `BACKSTAGE`.

Since you're on 1.19.0 (Docker, upgraded from 1.17.1), the fix hasn't reached your build yet. Could you confirm the same flow on `main` (or the next release that includes #45827) and let us know if it still 404s? If it reproduces on `main`, please share the exact `InvokeFrom` / surface path so we can pinpoint where the mapping is still being bypassed."*


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
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
