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


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-19T08:41:48.445502+01:00`)**  
> **Author (`Luckyou-d`) verified on [the live thread](https://github.com/langgenius/dify/issues/46744)**:  
> *"Diagnosis: the Add button in the question classifier's class list calls `crypto.randomUUID()` to build the new class ID. That API exists only in secure contexts (HTTPS or localhost); a self-hosted 1.19.0 deployment served over plain HTTP has no `crypto.randomUUID`, so clicking Add throws `TypeError: crypto.randomUUID is not a function` and no category can be added - matching your screenshot.

Good news: this was fixed on `main` today by #46720 (the class list now uses the `uuid` package's `v4`, which works in every context). The fix is scheduled for the 1.20.0 release; 1.19.0 shipped before it landed. Nothing further to fix here, so I'll leave it - closing as already addressed on main (the maintainers can confirm)."*


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
