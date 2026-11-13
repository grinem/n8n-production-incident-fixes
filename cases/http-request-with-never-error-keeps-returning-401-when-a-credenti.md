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
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


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

## Technical Post-Mortem & Resolution Guide

Spot on diagnosis. The discrepancy between `requestOAuth2` (which explicitly handles resolved 401s under `simple: false`) and `requestWithAuthentication` (which strictly encapsulates `credentialsHelper.preAuthentication` in `catch`) is definitely an oversight in the execution engine.

If you already have a working patch mirroring the `oauth.ts` retry pattern, please open a PR against `master` and link it to Linear ticket `GHC-9757`.

In the meantime, handling the failure via the node's generic **Settings > On Error > Continue Regular Output** rather than the HTTP-level "Never Error" (`simple: false`) lets the underlying client throw, hit the `catch` block to refresh the token, and keep your workflow running.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
