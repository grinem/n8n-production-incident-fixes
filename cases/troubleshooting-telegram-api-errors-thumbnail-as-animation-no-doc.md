---
layout: default
title: "Troubleshooting Telegram API Errors: 'Thumbnail as Animation' & 'No Document in Request' when using n8n HTTP Request"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-09
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "troubleshooting-telegram-api-errors-thumbnail-as-animation-no-doc"
---

# Troubleshooting Telegram API Errors: 'Thumbnail as Animation' & 'No Document in Request' when using n8n HTTP Request


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-09T21:27:47.662944`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Two things are breaking here. First, you're referencing the nested thumbnail ID (`$json.message.animation.thumbnail.file_id`) instead of the root media ID (`$json.message.animation.file_id`), so Telegram throws a type mismatch when it sees a static image hash hitting an animation endpoint.

Second, switch your HTTP Request node from `multipart/form-data` to pure JSON. Telegram expects an actual binary stream when multipart boundaries are declared, which fails if you're just passing a string `file_id`.

Set the node to POST to `[https]://api[.]telegram[.]org/bot<YOUR_BOT_TOKEN>/sendAnimation` (or `/sendDocument`), set Body Content Type to JSON, and send this payload:

**Patch Preview (First 3 lines of verified fix):**
```json
{
  "chat_id": "={{ $json.chat_id }}",
  "animation": "={{ $json.message.animation.file_id }}"
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
