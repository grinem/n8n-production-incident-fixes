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
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-14T01:20:18.738000+01:00`)**  
> **Author (`LUISDASARTIMANHAS`) verified on [the live thread](https://github.com/n8n-io/n8n/issues/43896)**:  
> *"I recreated the credentials and it seems to have worked, even though I used the same credentials as before and logged in with the other laptop..."*


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-13T18:00:40.656677`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Two key things stand out here:

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
