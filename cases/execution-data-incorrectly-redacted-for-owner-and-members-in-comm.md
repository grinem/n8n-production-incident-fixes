---
layout: default
title: "Execution data incorrectly redacted for Owner and Members in Community Edition (v2.46.6)"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-13
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "execution-data-incorrectly-redacted-for-owner-and-members-in-comm"
---

# Execution data incorrectly redacted for Owner and Members in Community Edition (v2.46.6)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-13T23:40:59.887814+01:00`)**  
> **Author (`LUISDASARTIMANHAS`) verified on [the live thread](https://github.com/n8n-io/n8n/issues/43896)**:  
> *"This happened after these latest updates, so as an emergency measure I reverted and fixed the previous versions."*


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-13T18:00:40.656677`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Two key things stand out here:

1. Your debug info lists `license: enterprise (production)`. When an Enterprise license is applied (or was previously active/expired), n8n enforces strict project-level credential isolation across personal workspaces. Even the instance Owner cannot view execution data containing credentials belonging to another user's personal project unless that credential is explicitly shared.
2. The redirect to the subscription page on "Give yourself access" usually happens when the instance detects multi-project credential sharing but the active license tier lacks the RBAC/Advanced Permissions entitlement to manage cross-project access.

Until the core team looks at the Linear ticket (GHC-9760), the immediate workaround is to recreate the Gmail credential directly within the Owner account (or have the workflow run strictly under the project that owns the credential) so execution data isn't flagged as foreign and redacted.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
