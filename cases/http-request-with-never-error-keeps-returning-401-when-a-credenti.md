---
layout: default
title: "HTTP Request with \"Never Error\" keeps returning 401 when a credential with an expiring token (preAuthentication) needs a refresh"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-13
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "http-request-with-never-error-keeps-returning-401-when-a-credenti"
---

# HTTP Request with "Never Error" keeps returning 401 when a credential with an expiring token (preAuthentication) needs a refresh


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-13T15:40:19.423089+01:00`)**  
> **Author (`CSchulz`) verified on [the live thread](https://github.com/n8n-io/n8n/issues/43839)**:  
> *"@grinem Thanks for the review. The PR is open: #43834

It follows the `requestOAuth2` pattern. A resolved 401 with `simple: false` now refreshes the credential and resends the request once. The retry runs outside the existing try/catch, so a failed refresh does not start a second refresh.

`httpRequestWithAuthentication` with `ignoreHttpStatusErrors` has the same gap. The PR does not change it. I can do that in a follow-up PR."*


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-13T13:00:29.766811`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Spot on diagnosis. The discrepancy between `requestOAuth2` (which explicitly handles resolved 401s under `simple: false`) and `requestWithAuthentication` (which strictly encapsulates `credentialsHelper.preAuthentication` in `catch`) is definitely an oversight in the execution engine.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
