---
layout: default
title: "Human Input submissions fail and workflow event streams return 404 when API_WORKFLOW_RUN_REPOSITORY uses LogStore"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-16
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "human-input-submissions-fail-and-workflow-event-streams-return-40"
---

# Human Input submissions fail and workflow event streams return 404 when API_WORKFLOW_RUN_REPOSITORY uses LogStore


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-16T08:00:34.879995`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The issue is missing protocol delegation to `self._sql_repo` inside `api/extensions/logstore/repositories/logstore_api_workflow_run_repository.py`.

Human input submissions and pause resumes depend on row-locking the active run in SQL via `get_workflow_run_by_id_for_update`, while the Celery retention workers call `get_cleanup_refs_batch_by_time_range`. Since both currently hit the default base stub and return `None`, the service layer throws a 404 during form execution and silent failures during retention.

Delegating those two methods to `self._sql_repo` resolves the failure:

**Patch Preview (First 3 lines of verified fix):**
```python
def get_workflow_run_by_id_for_update(
    self,
    session: Session,
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
