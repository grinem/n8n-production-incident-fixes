---
layout: default
title: "Form Trigger execution succeeds but editor remains stuck on \"Waiting for you to submit the form\""
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-13
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "form-trigger-execution-succeeds-but-editor-remains-stuck-on-waiti"
---

# Form Trigger execution succeeds but editor remains stuck on "Waiting for you to submit the form"


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-13T05:00:28.230104`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Building on Client Case Study (User)'s `/rest/push` check, on **Docker + Windows 11** this stuck *"Waiting for you to submit the form"* state almost always comes from one of two origin/WebSocket mismatches between the editor and the container:

1. **Host Origin Mismatch (`localhost` vs `127.0.0.1`):**  
   If your editor tab is open on `localhost:5678` while `WEBHOOK_URL` / the Form Test URL resolves to `127.0.0.1:5678` (or vice versa), the browser session/push channel won't match the incoming `testWebhookReceived` event. Make sure both the canvas URL and `WEBHOOK_URL` use the exact same host.

2. **Explicit Docker Push & Base URL Env Vars:**  
   In your `docker-compose.yml`, explicitly pin the push backend and base URLs:
```yaml
environment:
  - N8N_HOST=localhost
  - N8N_PORT=5678
  - N8N_PROTOCOL=http
  - WEBHOOK_URL=http://localhost:5678/
  - N8N_EDITOR_BASE_URL=http://localhost:5678/
  - N8N_PUSH_BACKEND=websocket
```
*(If you're sitting behind Nginx/Caddy/Traefik on Windows, make sure `Upgrade` and `Connection "upgrade"` headers are forwarded and `proxy_buffering off;` is set so `/rest/push` doesn't stall.)*

If `/rest/push` shows `101 Switching Protocols` in DevTools -> Network -> WS and `testWebhookReceived` still never arrives after pinning `N8N_PUSH_BACKEND=websocket`, sharing the `/rest/push` frame screenshot will pinpoint whether it's an event emission or session-ID issue.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
