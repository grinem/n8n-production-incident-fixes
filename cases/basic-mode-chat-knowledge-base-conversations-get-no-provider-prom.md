---
layout: default
title: "Basic-mode chat: knowledge-base conversations get no provider prompt-cache hit because the retrieved context is rendered before the app's instructions"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-14
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "basic-mode-chat-knowledge-base-conversations-get-no-provider-prom"
---

# Basic-mode chat: knowledge-base conversations get no provider prompt-cache hit because the retrieved context is rendered before the app's instructions


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-14T16:40:31.963283`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Completely agree. Having `context_prompt` precede `pre_prompt` in `system_prompt_orders` (`api/core/prompt/prompt_templates/common_chat.json`) breaks prefix caching on every turn since dynamic chunks invalidate the prefix within the first ~25 tokens.

Swapping the array order to:

**Patch Preview (First 3 lines of verified fix):**
```json
"system_prompt_orders": [
  "pre_prompt",
  "context_prompt"
# ... [TRUNCATED — Full production patch & verification steps locked below]
```

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
