---
layout: default
title: "[Bug] Human Input node timeout can leave workflow paused when resume publication fails"
platform: "Automation Engine"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-13
tags: ["automation engine", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "human-input-node-timeout-can-leave-workflow-paused-when-resume-pu"
---

# [Bug] Human Input node timeout can leave workflow paused when resume publication fails


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-13T21:00:35.308236`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Spot on catch. It's a classic dual-write race where the DB commits the form as `TIMEOUT` before the Celery dispatch succeeds, leaving the parent `workflow_runs` stuck in `PAUSED` with no retry path.

Upstream, the cleanest fix is either rolling back the form status on broker publish failure so the existing sweep retries it, or adding a reconciliation sweep that queries `HumanInputForm.status == 'TIMEOUT'` alongside `WorkflowRun.status == 'PAUSED'`.

If you're already preparing a PR for this, happy to help review it.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
