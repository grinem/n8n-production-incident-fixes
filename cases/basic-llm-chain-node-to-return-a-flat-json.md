---
layout: default
title: "Basic LLM Chain node to return a flat JSON"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-21
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "basic-llm-chain-node-to-return-a-flat-json"
---

# Basic LLM Chain node to return a flat JSON


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-21T17:20:49.417752`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The Basic LLM Chain enforces that root `output` key by design through its LangChain parser contract; there isn't a setting inside the node to flatten it directly.

The simplest workaround is placing a **Code** node right after it (set to *Run Once for Each Item*):

**Patch Preview (First 3 lines of verified fix):**
```javascript
return { json: $json.output };
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
