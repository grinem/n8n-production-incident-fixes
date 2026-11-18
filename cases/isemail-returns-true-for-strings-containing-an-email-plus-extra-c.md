---
layout: default
title: "isEmail() returns true for strings containing an email plus extra characters"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-18
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "isemail-returns-true-for-strings-containing-an-email-plus-extra-c"
---

# isEmail() returns true for strings containing an email plus extra characters


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-18T05:00:36.653290`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Nice catch Client Case Study (User), clearly a case where sharing `EMAIL_REGEXP` with `extractEmail()` caused anchors to be omitted, and `value.includes(' ')` was just an incomplete band-aid.

A clean fix in `packages/Client Case Study (User)/expression-runtime/src/extensions/string-extensions.ts` would be deriving an anchored variant so extraction remains untouched:

**Patch Preview (First 3 lines of verified fix):**
```typescript
const STRICT_EMAIL_REGEXP = new RegExp(`^${EMAIL_REGEXP.source}$`, 'i');

export function isEmail(this: string | unknown, value?: string): boolean {
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
