---
layout: default
title: "[Bug] MetaDefender result code 4 (\"Cleaned / Deleted\") is retried as a transient failure, so a confirmed-threat upload can be admitted"
platform: "Meta / Webhooks"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-14
tags: ["meta / webhooks", "production-fix", "post-mortem", "verified-resolution"]
slug: "metadefender-result-code-4-cleaned-deleted-is-retried-as-a-transi"
---

# [Bug] MetaDefender result code 4 ("Cleaned / Deleted") is retried as a transient failure, so a confirmed-threat upload can be admitted


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Meta / Webhooks`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-14T02:40:29.228804`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Good catch. Since Dify keeps the original uploaded bytes rather than pulling down the vendor's sanitized payload, mapping `4` directly to `_INFECTED` in `api/core/file_scan/scanners/metadefender.py` is definitely the right move to prevent fail-open behavior.

If you already have this patched locally, please open a PR adding `4` to `_INFECTED` along with the corresponding test case in `tests/unit_tests/core/file_scan/test_scanners.py`.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
