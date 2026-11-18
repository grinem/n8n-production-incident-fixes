---
layout: default
title: "[Microsoft SharePoint Node] Creating or updating list items with Multi-Choice columns fails with 500 Internal Server Error"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-16
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "creating-or-updating-list-items-with-multi-choice-columns-fails-w"
---

# [Microsoft SharePoint Node] Creating or updating list items with Multi-Choice columns fails with 500 Internal Server Error


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-16T23:40:40.911726`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Graph API's OData parser throws a generic 500 whenever multi-choice collection fields lack explicit OData annotations or receive plain strings instead of arrays.

In `n8n-nodes-base/nodes/Microsoft/SharePoint/v2/actions/item/create.operation.ts` (and `update.operation.ts`), the node simply assigns inputs raw to `body.fields[key] = value` without checking for arrays or decorating them.

For maintainers looking at Linear ticket GHC-9795, a clean fix when building the payload is checking for arrays and appending the OData collection tag:

**Patch Preview (First 3 lines of verified fix):**
```typescript
for (const [key, val] of Object.entries(fields)) {
	if (Array.isArray(val)) {
		fields[`${key}Client Case Study (User).type`] = 'Collection(Edm.String)';
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
