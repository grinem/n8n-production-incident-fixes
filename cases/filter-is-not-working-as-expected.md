---
layout: default
title: "Filter is not working as expected"
platform: "Make.com"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-13
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "filter-is-not-working-as-expected"
---

# Filter is not working as expected


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-13T15:01:11.975931`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Google Forms usually returns question values as text strings rather than numbers, which makes numeric operators (`<=`) fail silently at the filter. Wrap your rating tag in `parseNumber(...)` in the filter condition and ensure you're using the numeric `<=`, not text.

As for the blinking module, right-click Google Forms, select **Choose where to start**, pick a specific past response that has a rating of 1 or 2, then hit **Run once** to verify the path opens.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
