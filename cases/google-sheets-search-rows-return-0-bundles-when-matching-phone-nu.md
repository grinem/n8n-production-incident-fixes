---
layout: default
title: "Google sheets \"Search rows\" return 0 bundles when matching phone number from Twilio Webhook (causing A0:ZZ0 error in Update a Row)"
platform: "Make.com"
severity: "HIGH"
status: "Resolved"
date: 2026-11-16
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "google-sheets-search-rows-return-0-bundles-when-matching-phone-nu"
---

# Google sheets "Search rows" return 0 bundles when matching phone number from Twilio Webhook (causing A0:ZZ0 error in Update a Row)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-16T20:00:36.658766`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Yes, that's exactly what's happening. When you write digits without a `+` into Google Sheets with default formatting, Sheets automatically casts the cell to a Number, while `Text operator: Equal to` strictly looks for a string.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
