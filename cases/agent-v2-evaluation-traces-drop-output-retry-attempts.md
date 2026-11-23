---
layout: default
title: "Agent V2 evaluation traces drop output retry attempts"
platform: "Automation Engine"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-23
tags: ["automation engine", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "agent-v2-evaluation-traces-drop-output-retry-attempts"
---

# Agent V2 evaluation traces drop output retry attempts


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-23T11:22:58.124228`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The collector lifecycle is currently bound inside the retry iteration loop rather than the node's execution context. When schema validation fails on a backend output, the collector instance is torn down, dropping the previous attempt's tool calls and token counts from `node_metadata["evaluation_trace"]`.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
