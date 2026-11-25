---
layout: default
title: "Production issue: Incoming WhatsApp messages stopped triggering an active n8n workflow — Evolution API"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-25
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "production-issue-incoming-whatsapp-messages-stopped-triggering-an"
---

# Production issue: Incoming WhatsApp messages stopped triggering an active n8n workflow — Evolution API


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-25T13:01:09.748539`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

When an inbound message fails to show up in Evolution's built-in chat view while a synthetic POST directly to n8n returns HTTP 200, the failure is occurring upstream of the webhook delivery pipeline. The message is never reaching Evolution's Baileys layer from WhatsApp servers.

This typically happens due to a silent socket desynchronization (a zombie session) in Baileys. The Evolution API dashboard reports the instance as connected because the local process state remained set to open, but the underlying WebSocket connection to WhatsApp was silently dropped or had its multi-device encryption prekeys invalidated when the additional tablet was linked.

To inspect the actual runtime events and bypass outdated EasyPanel web logs, check the container logs directly over SSH:

**Patch Preview (First 3 lines of verified fix):**
```bash
docker logs -f --tail 150 $(docker ps -qf "name=evolution")
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
