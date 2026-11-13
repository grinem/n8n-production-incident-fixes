---
layout: default
title: "Sort Node Incorrectly Sorts Numbers in Descending Order"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-13
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "sort-node-incorrectly-sorts-numbers-in-descending-order"
---

# Sort Node Incorrectly Sorts Numbers in Descending Order


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-13T15:22:18.056995`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Could you share a quick 3-item raw JSON snippet of the input data right before the Sort node?

Usually this happens when the values are actually typed as strings (common with Postgres `BIGINT`/API payloads returning `"100"` instead of `100`), where lexicographical descending order puts `"9"` before `"100"`. Check the input in JSON view to see if the values are quoted or raw numbers.

If you've already verified they are strict numbers and descending is still inverted, drop the sample input payload so maintainers can reproduce the comparator regression on 2.47.7.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
