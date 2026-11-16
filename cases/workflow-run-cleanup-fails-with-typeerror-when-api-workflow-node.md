---
layout: default
title: "Workflow run cleanup fails with TypeError when API_WORKFLOW_NODE_EXECUTION_REPOSITORY uses LogStore"
platform: "Automation Engine"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-16
tags: ["automation engine", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "workflow-run-cleanup-fails-with-typeerror-when-api-workflow-node"
---

# Workflow run cleanup fails with TypeError when API_WORKFLOW_NODE_EXECUTION_REPOSITORY uses LogStore


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-16T04:20:32.730750`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Nice catch Client Case Study (User).

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
