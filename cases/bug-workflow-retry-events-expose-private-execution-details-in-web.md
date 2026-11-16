---
layout: default
title: "bug: workflow retry events expose private execution details in Web App streams"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-16
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "bug-workflow-retry-events-expose-private-execution-details-in-web"
---

# bug: workflow retry events expose private execution details in Web App streams


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-16T12:00:37.287502`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Confirmed, nice catch. `NodeRetryStreamResponse` was indeed missed in the converter type branches across both `AdvancedChatAppGenerateResponseConverter` and `WorkflowAppGenerateResponseConverter`, causing it to fall through to `to_dict()` and leak `process_data`.

Since `NodeRetryStreamResponse.to_ignore_detail_dict()` is already implemented, the fix is just grouping it into the existing redaction check in both `app_generator.py` files:

**Patch Preview (First 3 lines of verified fix):**
```python
if isinstance(response, (NodeStartedStreamResponse, NodeFinishedStreamResponse, NodeRetryStreamResponse)):
    return response.to_ignore_detail_dict()
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
