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
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-15T11:00:54.203834`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Check your browser DevTools (**Network** tab, filter by `Img` or `Fetch/XHR`) when opening the tools page. Look at the exact URL and status code returned for the tool icon requests (e.g. `404`, `502`, or `ERR_CONNECTION_REFUSED`).

In self-hosted Docker setups, this is usually caused by mismatched URL environment variables. If you access Dify via a remote IP or domain rather than `localhost`, check `docker/.env`:

```env
CONSOLE_API_URL=[http]://<YOUR_SERVER_IP_OR_DOMAIN>/console/api
CONSOLE_WEB_URL=[http]://<YOUR_SERVER_IP_OR_DOMAIN>
APP_API_URL=[http]://<YOUR_SERVER_IP_OR_DOMAIN>/api
APP_WEB_URL=[http]://<YOUR_SERVER_IP_OR_DOMAIN>
```

If these are still set to `[http]://localhost:5001` or `[http]://127[.]0[.]0[.]1`, the client browser will fail to fetch the provider icons remotely.

If your `.env` is already pointing to the correct address, let us know the failing request URL and HTTP status code from the network panel.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
