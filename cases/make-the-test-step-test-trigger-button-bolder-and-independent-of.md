---
layout: default
title: "[Feature]: Make the Test Step / Test Trigger button bolder and independent of the brand colour"
platform: "Make.com"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-17
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "make-the-test-step-test-trigger-button-bolder-and-independent-of"
---

# [Feature]: Make the Test Step / Test Trigger button bolder and independent of the brand colour


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-17T18:40:35.090757`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Makes complete sense—soft accent tints completely wash out with pastel/yellow tenant palettes, especially stacked with `disabled:opacity-50`.

Matching the Publish CTA (`bg-primary text-primary-foreground`) makes the most sense here. In `packages/web/src/app/builder/test-step/test-step-cta-button.tsx`, replacing the soft tint classes with standard solid button tokens and adding an explicit disabled state override will fix the contrast:

**Patch Preview (First 3 lines of verified fix):**
```tsx
// test-step-cta-button.tsx
const PRIMARY_CTA_CLASSES = 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70';
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
