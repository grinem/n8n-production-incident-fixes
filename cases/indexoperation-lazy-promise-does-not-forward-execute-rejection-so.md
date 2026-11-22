---
layout: default
title: "IndexOperation lazy promise does not forward execute() rejection (source unchanged in @n8n/db1.47.4)"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-22
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "indexoperation-lazy-promise-does-not-forward-execute-rejection-so"
---

# IndexOperation lazy promise does not forward execute() rejection (source unchanged in @n8n/db1.47.4)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-22T08:20:52.038952`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The constructor in `dist/migrations/dsl/indices.js` swallows the rejection path by omitting `reject` from the executor:

**Patch Preview (First 3 lines of verified fix):**
```javascript
super((resolve, reject) => {
  void this.execute(queryRunner).then(resolve, reject);
});
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
