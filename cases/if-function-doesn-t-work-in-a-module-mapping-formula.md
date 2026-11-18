---
layout: default
title: "IF function doesn't work in a module mapping formula"
platform: "Make.com"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-18
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "if-function-doesn-t-work-in-a-module-mapping-formula"
---

# IF function doesn't work in a module mapping formula


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-18T12:00:44.397645`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Your webhook is passing `"CreditInvoice"` as a string rather than a native boolean. Make's `=` operator checks type strictly, so the blue boolean `true` pill will never evaluate to true against the string `"true"`.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
