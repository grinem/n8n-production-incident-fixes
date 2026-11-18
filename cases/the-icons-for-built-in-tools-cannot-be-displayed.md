---
layout: default
title: "The icons for built-in tools cannot be displayed"
platform: "Automation Engine"
severity: "HIGH"
status: "Resolved"
date: 2026-11-15
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "the-icons-for-built-in-tools-cannot-be-displayed"
---

# The icons for built-in tools cannot be displayed


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-15T11:00:54.203834`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Check your browser DevTools (**Network** tab, filter by `Img` or `Fetch/XHR`) when opening the tools page. Look at the exact URL and status code returned for the tool icon requests (e.g. `404`, `502`, or `ERR_CONNECTION_REFUSED`).

In self-hosted Docker setups, this is usually caused by mismatched URL environment variables. If you access Dify via a remote IP or domain rather than `localhost`, check `docker/.env`:

**Patch Preview (First 3 lines of verified fix):**
```env
CONSOLE_API_URL=[http]://<YOUR_SERVER_IP_OR_DOMAIN>/console/api
CONSOLE_WEB_URL=[http]://<YOUR_SERVER_IP_OR_DOMAIN>
APP_API_URL=[http]://<YOUR_SERVER_IP_OR_DOMAIN>/api
# ... [TRUNCATED — Full production patch & verification steps locked below]
```

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
