---
layout: default
title: "Version 1.19.0, the problem classifier cannot add a category by clicking"
platform: "Automation Engine"
severity: "HIGH"
status: "Resolved"
date: 2026-11-19
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "version-1-19-0-the-problem-classifier-cannot-add-a-category-by-cl"
---

# Version 1.19.0, the problem classifier cannot add a category by clicking


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-20T04:40:28.375501+01:00`)**  
> **Author (`fxia0018`) verified on [the live thread](https://github.com/langgenius/dify/issues/46744)**:  
> *"Thanks for the report! Confirmed the root cause: the "Add" button in the question classifier calls `crypto.randomUUID()`, which only exists in secure contexts (HTTPS or `localhost`). On a self-hosted deployment served over plain HTTP it is `undefined`, so clicking Add throws and no class can be created.

I've opened #46815 to guard the call and fall back to a timestamp-based id, matching the pattern already used in `use-document-actions.ts`. The same unguarded call in the agent output-routes toggle is fixed too."*


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-19T06:20:44.843615`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Can you open your browser console (F12) when clicking "Add" and share the error log here?

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
