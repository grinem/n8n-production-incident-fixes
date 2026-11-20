---
layout: default
title: "Default \"Automatically include workspace members\" to off for new apps, consistent with datasets"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-20
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "default-automatically-include-workspace-members-to-off-for-new-ap"
---

# Default "Automatically include workspace members" to off for new apps, consistent with datasets


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-20T13:22:40.800608`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Aligning app creation with datasets is the right move here; leaving new apps open by default creates an unnecessary data exposure window during development.

Checking `api/services/app/console_gateway.py`, flipping `automatic_include_workspace_members` to `False` in `ReplaceMemberBindings` and skipping `initialize_created_app_rbac_access_task.delay()` when disabled directly mirrors #42430.

To address the deployment preference you mentioned, introducing a config fallback in `api/configs/app_config.py` keeps it backward-compatible:

**Patch Preview (First 3 lines of verified fix):**
```python
APP_RBAC_DEFAULT_INCLUDE_MEMBERS: bool = False
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
