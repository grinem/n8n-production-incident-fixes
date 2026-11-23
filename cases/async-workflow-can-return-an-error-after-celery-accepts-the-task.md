---
layout: default
title: "Async workflow can return an error after Celery accepts the task"
platform: "Automation Engine"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-22
tags: ["automation engine", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "async-workflow-can-return-an-error-after-celery-accepts-the-task"
---

# Async workflow can return an error after Celery accepts the task


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-22T06:40:52.042822`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Because `SQLAlchemyWorkflowTriggerExecutionRepository.start()` explicitly picks up both `PENDING` and `QUEUED` records, the worker doesn't actually depend on `mark_queued()` succeeding to process the job.

Propagating the DB error back to the caller once `publish()` returns creates duplicate runs because upstream webhooks and schedulers treat the 5xx as a transient dispatch failure and retry.

Wrapping `TriggerExecutionLogs.mark_queued()` in a non-fatal `try/except` block inside `AsyncWorkflowService.trigger_workflow_async()` avoids this immediately:

**Patch Preview (First 3 lines of verified fix):**
```python
task_id = CeleryWorkflowQueuePublisher.publish(...)

try:
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
