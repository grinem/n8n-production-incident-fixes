---
layout: default
title: "IMAP piece leaks its socket when login fails; 5 minutes later the socket timeout crashes an unrelated flow run (`SANDBOX_INTERNAL_ERROR`)"
platform: "Activepieces"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-17
tags: ["activepieces", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "imap-piece-leaks-its-socket-when-login-fails-5-minutes-later-the"
---

# IMAP piece leaks its socket when login fails; 5 minutes later the socket timeout crashes an unrelated flow run (`SANDBOX_INTERNAL_ERROR`)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Activepieces`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-17T10:40:36.306113`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Spot-on diagnosis. In `SANDBOX_CODE_ONLY`, process reuse causes any unhandled socket error emitted after the promise rejects to bubble up as an `uncaughtException` in the worker process.

The fix belongs in `packages/pieces/community/imap` around the `ImapFlow` initialization and connection wrapper. You need to bind an error handler to swallow stray stream events on dead connections and force-close the underlying socket on auth/connection failure:

**Patch Preview (First 3 lines of verified fix):**
```typescript
const client = new ImapFlow({
  host: auth.host,
  port: auth.port,
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
