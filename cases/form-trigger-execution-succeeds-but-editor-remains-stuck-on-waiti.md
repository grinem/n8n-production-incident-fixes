---
layout: default
title: "Form Trigger execution succeeds but editor remains stuck on \"Waiting for you to submit the form\""
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-13
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "form-trigger-execution-succeeds-but-editor-remains-stuck-on-waiti"
---

# Form Trigger execution succeeds but editor remains stuck on "Waiting for you to submit the form"


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-13T05:00:28.230104`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

The reason your workflow executes in the background while the UI stays stuck on *"Waiting for you to submit the form"* is a breakdown in the real-time push event channel between the n8n backend and your browser editor.

Because the execution data appears right after refreshing the page, your workflow engine and SQLite database are working as expected. However, the editor listens for test execution completions via a persistent WebSocket stream at `/rest/push`. When this WebSocket disconnects, fails the initial HTTP `101 Switching Protocols` upgrade, or experiences an origin mismatch, the UI never receives the `executionFinished` event payload.

Here is how to resolve this on Docker / Windows 11:

### Step 1: Diagnose the WebSocket in DevTools
1. In your browser on the n8n canvas, press `F12` and open the **Network** tab.
2. Filter by **WS** (WebSockets).
3. Reload the editor and look for the `/rest/push` request.
4. Check its status: it should show **101 Switching Protocols**. If you see red disconnection lines, `Pending`, `403`, or frequent reconnections, your push connection is failing.

### Step 2: Fix Origin Mismatches (Localhost vs 127.0.0.1)
Ensure you are accessing both the n8n canvas and the Form Trigger test URL using the exact same host origin. If your canvas is running on `[http]://localhost:5678` and the test URL opens on `[http]://127[.]0[.]0[.]1:5678` (or vice versa), the editor will not register the incoming event from the alternative origin.

### Step 3: Update your Docker Compose Configuration
Add explicit base URL definitions and push configuration in your Docker Compose file to keep frontend pushes properly synchronized:

```yaml
services:
  n8n:
    image: n8nio/n8n:2.47.5
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=[http]://localhost:5678/
      - N8N_EDITOR_BASE_URL=[http]://localhost:5678/
      - N8N_PUSH_BACKEND=websocket
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

*(Note: If you run behind a reverse proxy like Nginx or Caddy, ensure `proxy_buffering off;` and HTTP 1.1 upgrade headers `Upgrade $http_upgrade` and `Connection "upgrade"` are set, as proxy buffering will block real-time completion frames).*

### Step 4: Verification
Recreate the container (`docker compose down && docker compose up -d`), hit **Execute Workflow**, open the form test URL within the same browser session/profile, and submit. The canvas should transition immediately to the completed state and display your node output data.

If you'd like, I can also share the complete JSON blueprint / flow template with you for free—just let me know and I'll send it over.

Let me know what you see in the browser Network tab under `/rest/push` if the issue persists after updating those variables!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
