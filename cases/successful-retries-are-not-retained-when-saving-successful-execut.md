---
layout: default
title: "Successful retries are not retained when saving successful executions is disabled"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-14
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "successful-retries-are-not-retained-when-saving-successful-execut"
---

# Successful retries are not retained when saving successful executions is disabled


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-14T13:20:30.526382`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

This is an accurate catch. The issue is that the runner's execution persistence policy evaluates the child retry independently: because `EXECUTIONS_DATA_SAVE_ON_SUCCESS=none`, the child record is dropped before or without committing the foreign key update (`execution_entity.retrySuccessId`) back onto the parent failed execution.

Until core decouples retry-lineage tracking from raw success retention, two practical workarounds:
1. Enable `EXECUTIONS_DATA_SAVE_ON_SUCCESS=all` paired with aggressive pruning (`EXECUTIONS_DATA_MAX_AGE=24` or lower) so metadata is written and settled before being pruned.
2. If retrying via API, check the synchronous response of `POST /api/v1/executions/{id}/retry` directly for `status: "success"` and track settled parent IDs in an external set/cache rather than polling `retrySuccessId` from n8n's DB.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
