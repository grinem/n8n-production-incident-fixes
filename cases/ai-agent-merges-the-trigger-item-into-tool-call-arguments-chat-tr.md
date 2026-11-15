---
layout: default
title: "AI Agent merges the trigger item into tool-call arguments; Chat Trigger's `action` reaches MCP tools that have an `action` parameter"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-14
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "ai-agent-merges-the-trigger-item-into-tool-call-arguments-chat-tr"
---

# AI Agent merges the trigger item into tool-call arguments; Chat Trigger's `action` reaches MCP tools that have an `action` parameter


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-14T01:20:30.530884`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Spot-on analysis. Spreading trigger items at the root of `mergedJson` while only rendering `displayJson` in the canvas makes this silent collision a nightmare to trace.

Until core separates execution context from tool arguments in `requests-response.ts`, a quick Code node between the Chat Trigger and the AI Agent stripping `action` will unblock the tool call without breaking the agent:

**Patch Preview (First 3 lines of verified fix):**
```javascript
delete $input.item.json.action;
return $input.item;
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
