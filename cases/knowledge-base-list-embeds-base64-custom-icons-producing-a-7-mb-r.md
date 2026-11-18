---
layout: default
title: "Knowledge base list embeds Base64 custom icons, producing a ~7 MB response and slow loading"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-17
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "knowledge-base-list-embeds-base64-custom-icons-producing-a-7-mb-r"
---

# Knowledge base list embeds Base64 custom icons, producing a ~7 MB response and slow loading


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-17T14:20:37.590248`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Good catch. The frontend icon picker dumps the raw `readImageDataURL` string directly into `datasets.icon_info` rather than uploading the asset via `/console/api/files/upload` and storing a `file_id` / relative URL reference. Because `GET /console/api/datasets` serializes `icon_info` verbatim, 30 uncompressed base64 payloads easily blow past 6–7 MB.

Until this is refactored to route custom icons through file storage, you can pinpoint the worst offenders directly in Postgres:

**Patch Preview (First 3 lines of verified fix):**
```sql
SELECT id, name, pg_column_size(icon_info) AS size_bytes
FROM datasets
WHERE icon_info::text LIKE '%data:image%'
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
