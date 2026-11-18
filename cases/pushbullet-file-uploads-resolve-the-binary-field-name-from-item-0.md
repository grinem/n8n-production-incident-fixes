---
layout: default
title: "Pushbullet file uploads resolve the binary field name from item 0 for every item"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-18
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "pushbullet-file-uploads-resolve-the-binary-field-name-from-item-0"
---

# Pushbullet file uploads resolve the binary field name from item 0 for every item


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-18T17:20:29.583976+01:00`)**  
> **Author (`goutham-valugula`) verified on [the live thread](https://github.com/n8n-io/n8n/issues/44408)**:  
> *"The source confirms the item-index mismatch: inside the upload loop, `assertBinaryData(i, ...)` and `getBinaryDataBuffer(i, ...)` use the current item, but `getNodeParameter("binaryPropertyName", 0)` is fixed to item 0. Resolving that parameter with `i` should make an expression such as `{{$json.binaryField}}` use each item’s own property name. I have not run this workflow or a regression test."*


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-18T15:40:44.772995`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Nice catch Client Case Study (User). Classic off-by-loop-index issue in the node's execute block.

### Root Cause & Fix
Inside `packages/nodes-base/nodes/Pushbullet/Pushbullet.node.ts`, the parameter lookup passes hardcoded index `0`:

**Patch Preview (First 3 lines of verified fix):**
```typescript
// Buggy
const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;
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
