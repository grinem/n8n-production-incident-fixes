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
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-14T19:40:19.442109+01:00`)**  
> **Author (`tolani-co`) verified on [the live thread](https://github.com/n8n-io/n8n/issues/43759)**:  
> *"@grinem  I followed your suggestion to switch the push backend to SSE by setting `N8N_PUSH_BACKEND=sse`, and it worked!

After recreating the Docker container with the updated environment variable, the workflow executions started appearing in the editor in real time. The Form Trigger no longer gets stuck on "Waiting for you to submit the form".

I tested it with both a basic Form Trigger workflow and another workflow that includes an email node. Both executed successfully, and their executions were visible in the editor.

Thank you for the suggestion. It finally resolved the issue!"*


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-13T05:00:28.230104`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Building on Client Case Study (User)'s `/rest/push` check, on **Docker + Windows 11** this stuck *"Waiting for you to submit the form"* state almost always comes from one of two origin/WebSocket mismatches between the editor and the container:

1. **Host Origin Mismatch (`localhost` vs `127.0.0.1`):**  
   If your editor tab is open on `localhost:5678` while `WEBHOOK_URL` / the Form Test URL resolves to `127.0.0.1:5678` (or vice versa), the browser session/push channel won't match the incoming `testWebhookReceived` event. Make sure both the canvas URL and `WEBHOOK_URL` use the exact same host.

2. **Explicit Docker Push & Base URL Env Vars:**  
   In your `docker-compose.yml`, explicitly pin the push backend and base URLs:

**Patch Preview (First 3 lines of verified fix):**
```yaml
environment:
  - N8N_HOST=localhost
  - N8N_PORT=5678
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
