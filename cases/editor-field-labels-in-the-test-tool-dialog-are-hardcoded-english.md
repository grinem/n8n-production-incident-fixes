---
layout: default
title: "Editor: Field labels in the test tool dialog are hardcoded English"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-20
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "editor-field-labels-in-the-test-tool-dialog-are-hardcoded-english"
---

# Editor: Field labels in the test tool dialog are hardcoded English


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-20T08:30:04.874102`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

When opening the PR, remember to register the new keys under `packages/frontend/editor-ui/src/app/locale/en.json` so CrowdIn can pick them up properly.

In `useToolParameters.ts`, make sure to wire them via `i18n.baseText()`:

**Patch Preview (First 3 lines of verified fix):**
```typescript
label: i18n.baseText('tools.parameter.query'),
label: i18n.baseText('tools.parameter.toolName'),
errorMessage = i18n.baseText('tools.error.unknown');
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
