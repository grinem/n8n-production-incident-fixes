---
layout: default
title: "Uploaded avatars return 404 for other users in workflow collaboration"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-18
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "uploaded-avatars-return-404-for-other-users-in-workflow-collabora"
---

# Uploaded avatars return 404 for other users in workflow collaboration


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-18T07:30:52.674754`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Good catch on #35771. The regression is in `AccountAvatarApi` / `AccountService`: querying `UploadFile` explicitly enforces `UploadFile.created_by == current_user.id`, which drops User A's uploaded file ID when requested by User B during collaboration presence broadcast.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
